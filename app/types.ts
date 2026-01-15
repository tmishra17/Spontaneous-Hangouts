export type Hangout = {
    id: number;
    activity: string;
    hour: string;
    minute: string;
    attendees: number;
    maxAttendees: number;
    location: string;
    description: string;
    editing: boolean;
  };