export interface AgentLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface HITLTask {
  id: string;
  originalRequest: string;
  proposedAction: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  createdAt: string;
  resolvedAt?: string;
}

export interface AgentState {
  agent_id: string;
  status: 'IDLE' | 'BUSY' | 'SUSPENDED';
  uptime: number;
  last_sync: string;
  logs: AgentLog[];
  hitl_queue: HITLTask[];
  documents: {
    id: string;
    name: string;
    mimeType: string;
    uploadedAt: string;
  }[];
}

export const ATLAS_API = {
  async getState(): Promise<AgentState> {
    const res = await fetch('/api/state');
    return res.json();
  },
  
  async log(level: AgentLog['level'], message: string) {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message })
    });
  },

  async approveHITL(taskId: string, action: 'approve' | 'deny') {
    await fetch('/api/hitl/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, action })
    });
  },

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
};
