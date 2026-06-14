-- Table to store absolute request timestamps per identifier
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
    id BIGSERIAL PRIMARY KEY,
    client_identifier TEXT NOT NULL,
    request_timestamp TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- High-performance index for window filtration and old record cleanup pruning
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_identifier_time 
ON public.rate_limit_logs (client_identifier, request_timestamp);

-- Function to execute sliding-window evaluations
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_max_requests INT,
    p_window_seconds INT
) 
RETURNS BOOLEAN AS $$
DECLARE
    v_current_count INT;
    v_window_start TIMESTAMPTZ;
BEGIN
    v_window_start := clock_timestamp() - (p_window_seconds || ' seconds')::INTERVAL;
    
    -- 1. Prune completely dead historical records for this client to keep storage lean
    DELETE FROM public.rate_limit_logs 
    WHERE client_identifier = p_identifier 
      AND request_timestamp < v_window_start;
      
    -- 2. Count active hits within the current sliding window
    SELECT COUNT(*)::INT INTO v_current_count
    FROM public.rate_limit_logs
    WHERE client_identifier = p_identifier
      AND request_timestamp >= v_window_start;
      
    -- 3. If client has room, log this hit and return true (allowed)
    IF v_current_count < p_max_requests THEN
        INSERT INTO public.rate_limit_logs (client_identifier)
        VALUES (p_identifier);
        RETURN TRUE;
    ELSE
        -- Limit exceeded (blocked)
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
