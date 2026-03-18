import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Session, Station, Group, GroupProgress } from '@/types';
import { Template } from '@/data/templates';
import { supabase } from '@/lib/supabase';

interface SessionState {
    session: Session | null;
    helpRequests: HelpRequest[];

    // Actions
    initSession: (title: string, teacherId: string, type?: "station" | "game") => void;
    updateTitle: (title: string) => void;
    updateType: (type: "station" | "game") => void;
    loadTemplate: (templateData: Template) => void;

    // Station Actions
    addStation: () => void;
    updateStation: (id: string, data: Partial<Station>) => void;
    removeStation: (id: string) => void;

    // Group Actions  
    addGroup: (name: string) => void;
    removeGroup: (id: string) => void;

    // Start Session
    startSession: () => void;
    sendHelpRequest: (groupId: string, stationId: string, message: string) => Promise<void>;
    resolveHelp: (id: string) => Promise<void>;

    // Group Progress
    updateGroupProgress: (groupId: string, stationId: string, data: Partial<GroupProgress>) => Promise<void>;

    // Supabase Sync
    syncFromSupabase: (sessionId: string) => Promise<void>;
    subscribeToChanges: (sessionId: string) => void;
}

export interface HelpRequest {
    id: string;
    groupId: string;
    stationId: string;
    message: string;
    resolved: boolean;
    timestamp: number;
}

const createEmptyStation = (order: number): Station => ({
    id: uuidv4(),
    name: `Góc ${order}`,
    description: '',
    durationMinutes: 10,
    instructions: '',
    tasks: [{ id: uuidv4(), text: 'Nhiệm vụ 1', isCompleted: false }],
    bonusTasks: [],
    hints: [
        "Hãy đọc kỹ yêu cầu số 1 nhé!",
        "Chú ý màu sắc của các đồ vật trên bàn thử xem?",
        "Nếu khó quá thì thử hỏi bạn bên cạnh xem nào!"
    ],
    quiz: [{
        id: uuidv4(),
        question: "Cái gì có cánh mà không biết bay?",
        options: ["Con chim non", "Máy bay", "Con vịt", "Cái quạt"],
        correctIndex: 3
    }]
});

export const useSessionStore = create<SessionState>((set) => ({
    session: null,
    helpRequests: [],

    initSession: async (title, teacherId, type = "station") => {
        const newSession: Session = {
            id: uuidv4(),
            teacherId,
            title,
            type: type as "station" | "game",
            status: 'draft',
            stations: [createEmptyStation(1), createEmptyStation(2)],
            groups: [],
        };

        set({ session: newSession, helpRequests: [] });

        // Sync to Supabase if available
        try {
            await supabase.from('sessions').upsert(newSession);
        } catch (e) {
            console.error("Failed to sync session to Supabase:", e);
        }
    },

    updateTitle: async (title) => {
        set((state) => ({
            session: state.session ? { ...state.session, title } : null
        }));
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ title }).eq('id', session.id);
    },

    updateType: async (type) => {
        set((state) => ({
            session: state.session ? { ...state.session, type } : null
        }));
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ type }).eq('id', session.id);
    },

    loadTemplate: (templateData) => set((state) => {
        if (!state.session) return state;

        // Transform Partial<Station> from template into full Station objects
        const fullStations = templateData.stations.map((st: Partial<Station>, index: number) => {
            const emptySt = createEmptyStation(index + 1);
            return {
                ...emptySt,
                id: uuidv4(),
                name: st.name || emptySt.name,
                durationMinutes: st.durationMinutes || emptySt.durationMinutes,
                instructions: st.instructions || emptySt.instructions,
                bonusTasks: st.bonusTasks || [],
                hints: st.hints || [],
                quiz: st.quiz || emptySt.quiz
            };
        });

        return {
            session: {
                ...state.session,
                title: templateData.title,
                type: templateData.type,
                stations: fullStations
            }
        };
    }),

    addStation: async () => {
        set((state) => {
            if (!state.session) return state;
            if (state.session.stations.length >= 10) return state;
            const newStation = createEmptyStation(state.session.stations.length + 1);
            return {
                session: { ...state.session, stations: [...state.session.stations, newStation] }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ stations: session.stations }).eq('id', session.id);
    },

    updateStation: async (id, data) => {
        set((state) => {
            if (!state.session) return state;
            return {
                session: {
                    ...state.session,
                    stations: state.session.stations.map(st => st.id === id ? { ...st, ...data } : st)
                }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ stations: session.stations }).eq('id', session.id);
    },

    removeStation: async (id) => {
        set((state) => {
            if (!state.session) return state;
            if (state.session.stations.length <= 2) return state;
            return {
                session: {
                    ...state.session,
                    stations: state.session.stations.filter(st => st.id !== id)
                }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ stations: session.stations }).eq('id', session.id);
    },

    addGroup: async (name) => {
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        set((state) => {
            if (!state.session) return state;
            return {
                session: {
                    ...state.session,
                    groups: [...state.session.groups, { id: uuidv4(), name, pin, members: [], currentStationId: null, progress: [] }]
                }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ groups: session.groups }).eq('id', session.id);
    },

    removeGroup: async (id) => {
        set((state) => {
            if (!state.session) return state;
            return {
                session: {
                    ...state.session,
                    groups: state.session.groups.filter(g => g.id !== id)
                }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ groups: session.groups }).eq('id', session.id);
    },

    startSession: async () => {
        set((state) => {
            if (!state.session) return state;
            
            // Assign groups to their first station if not already assigned
            const firstStationId = state.session.stations[0]?.id || null;
            const updatedGroups = state.session.groups.map(g => ({
                ...g,
                currentStationId: g.currentStationId || firstStationId
            }));

            return {
                session: {
                    ...state.session,
                    groups: updatedGroups,
                    status: 'active',
                    startTime: Date.now()
                }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({
            groups: session.groups,
            status: session.status,
            startTime: session.startTime
        }).eq('id', session.id);
    },

    sendHelpRequest: async (groupId, stationId, message) => {
        const newRequest: HelpRequest = {
            id: uuidv4(),
            groupId,
            stationId,
            message,
            resolved: false,
            timestamp: Date.now()
        };
        set((state) => ({
            helpRequests: [newRequest, ...state.helpRequests]
        }));
        // Sync to help_requests table
        const session = useSessionStore.getState().session;
        if (session) {
            await supabase.from('help_requests').insert({
                ...newRequest,
                sessionId: session.id
            });
        }
    },

    resolveHelp: async (reqId) => {
        set((state) => ({
            helpRequests: state.helpRequests.map(r => r.id === reqId ? { ...r, resolved: true } : r)
        }));
        await supabase.from('help_requests').update({ resolved: true }).eq('id', reqId);
    },

    updateGroupProgress: async (groupId, stationId, data) => {
        set((state) => {
            if (!state.session) return state;
            return {
                session: {
                    ...state.session,
                    groups: state.session.groups.map(g => {
                        if (g.id !== groupId) return g;
                        const existingProgress = g.progress.find(p => p.stationId === stationId);
                        const newProgress: GroupProgress = existingProgress 
                            ? { ...existingProgress, ...data }
                            : { stationId, status: (data.status || 'in_progress') as any, score: 0, bonusScore: 0, ...data };
                        
                        return {
                            ...g,
                            progress: g.progress.some(p => p.stationId === stationId)
                                ? g.progress.map(p => p.stationId === stationId ? newProgress : p)
                                : [...g.progress, newProgress]
                        };
                    })
                }
            };
        });
        const session = useSessionStore.getState().session;
        if (session) await supabase.from('sessions').update({ groups: session.groups }).eq('id', session.id);
    },

    syncFromSupabase: async (sessionId) => {
        const { data, error } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
        if (data && !error) {
            set({ session: data });
        }
    },

    subscribeToChanges: (sessionId) => {
        supabase
            .channel('session-updates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
                set({ session: payload.new as Session });
            })
            .subscribe();
    }
}));
