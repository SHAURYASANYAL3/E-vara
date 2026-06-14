# Graph Database Schema Design (Neo4j) for Identity Relationships

This document outlines the conceptual graph database schema designed to map complex threat actor identity relationships, moving beyond traditional relational constraints to trace multi-vector connections.

## 1. Nodes (Entities)

- ThreatActor: Represents the core entity or malicious group.
  - Properties: id, alias, originCountry, confidenceLevel, firstObserved
- Identity: Represents specific digital profiles used by actors.
  - Properties: id, username, email, realName, creationDate
- Infrastructure: Relational assets used in campaigns.
  - Properties: id, ipAddress, domain, hostingProvider, asn
- Indicator: Digital markers left behind during activities.
  - Properties: id, type (e.g., FileHash, RegistryKey), value, severity

## 2. Relationships (Edges)

- (:ThreatActor) -[:USES_IDENTITY]-> (:Identity)
- (:ThreatActor) -[:CONTROLS]-> (:Infrastructure)
- (:Identity) -[:REGISTERED]-> (:Infrastructure)
- (:Infrastructure) -[:EXHIBITS]-> (:Indicator)
- (:ThreatActor) -[:ASSOCIATED_WITH {relationshipType: "Collaborator"}]-> (:ThreatActor)

## 3. Sample Cypher Queries for Analysis

### Tracking Multi-vector Infrastructure Overlaps

MATCH (ta1:ThreatActor)-[:CONTROLS]->(i:Infrastructure)<-[:CONTROLS]-(ta2:ThreatActor)
WHERE ta1.id <> ta2.id
RETURN i.domain, ta1.alias, ta2.alias;
