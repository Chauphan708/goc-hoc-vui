-- SQL Schema for Góc Học Vui

-- 1. Table for Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    teacherId TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'station',
    status TEXT NOT NULL DEFAULT 'draft',
    stations JSONB NOT NULL DEFAULT '[]',
    groups JSONB NOT NULL DEFAULT '[]',
    startTime BIGINT,
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Help Requests (Optional, can be JSONB in sessions but separate table is better for real-time)
CREATE TABLE help_requests (
    id UUID PRIMARY KEY,
    sessionId UUID REFERENCES sessions(id) ON DELETE CASCADE,
    groupId TEXT NOT NULL,
    stationId TEXT NOT NULL,
    message TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    timestamp BIGINT,
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Note: In Supabase, make sure to enable Realtime for these tables in the "Realtime" section of the Dashboard.
