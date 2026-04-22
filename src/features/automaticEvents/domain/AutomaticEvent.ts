export interface EventPayload {
    id_template: number;
    reference_date?: string;
}

export interface AutomaticEvent {
    id: number;
    name: string;
    event_type: string;
    cron_expression: string;
    timezone: string;
    is_active: boolean;
    starts_at: string;
    ends_at?: string | null;
    next_run_at?: string | null;
    payload: EventPayload;
    created_at?: string;
    updated_at?: string;
}

export interface EventRun {
    id: number;
    id_automatic_event: number;
    status: 'success' | 'failed' | 'pending';
    executed_at: string;
    message?: string;
    details?: any;
}

export interface CreateEventRequest {
    name: string;
    event_type: string;
    cron_expression: string;
    timezone: string;
    is_active: boolean;
    starts_at: string;
    ends_at?: string | null;
    payload: EventPayload;
}

export type UpdateEventRequest = Partial<CreateEventRequest>;
