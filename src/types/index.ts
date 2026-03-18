export type StationStatus = "pending" | "in_progress" | "completed" | "debt";

export interface TaskItem {
    id: string;
    text: string;
    isCompleted: boolean;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Station {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    instructions: string; // Markdown or plain text
    tasks: TaskItem[];
    bonusTasks?: TaskItem[];
    hints: string[];
    quiz?: QuizQuestion[];
}

export interface GroupProgress {
    stationId: string;
    status: StationStatus;
    score: number;
    bonusScore: number;
}

export interface Group {
    id: string;
    name: string;
    pin: string; // 4-digit code to join
    members: string[];
    currentStationId: string | null;
    progress: GroupProgress[];
}

export interface Session {
    id: string;
    teacherId: string;
    title: string;
    type: "station" | "game";
    status: "draft" | "active" | "completed";
    stations: Station[];
    groups: Group[];
    startTime?: number; // timestamp
}
