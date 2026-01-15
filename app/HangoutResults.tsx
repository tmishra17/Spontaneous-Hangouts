import { Hangout } from './types'
import { MapPin, Users } from 'lucide-react';

export default function HangoutResults({hangout}: {hangout: Hangout}) {
    return (
        <>
            
            <div className="flex gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hangout.location}
                </div>
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {hangout.attendees}/{hangout.maxAttendees} people
                </div>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {hangout.activity}
                        </h3>
                        <p className="text-gray-600 text-sm">{hangout.description}</p>
                    </div>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        In {' '}
                            {hangout.hour !== "0" && hangout.minute !== "0"? (
                            <span>{hangout.hour} hour(s) and {hangout.minute} mins </span>
                            ): hangout.hour !== "0" ? (
                            <span>{hangout.hour} hour(s) </span>
                            ):
                            <span>{hangout.minute} mins</span>
                            }
                    </span>
                </div>
            </div>
      </>
    )
}