from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

# FUTURE REFERENCE FOR ADDING SECURE ORIGINS
FRONTEND_URL = "https://spontaneous-hangouts.vercel.app"
# BACKEND_URL = "https://spontaneous-hangouts-production.up.railway.app/hangouts"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:3000",  # For local development
        "http://127.0.0.1:3000",  # Alternative localhost
    ], # allow from anywhere
    allow_credentials = True,
    allow_methods=["*"], # Allow all requests between two ports (can limit to only 1,2, or 3)
    allow_headers=["*"] # allow all headers, accept any header frontend sends (which meta data fields should be in request)
)

print("CORS Middeware added!")

con = sqlite3.connect("data.db", check_same_thread=False)

con.row_factory = sqlite3.Row

cur = con.cursor() # setup cursor  (worker) creates initial table
cur.execute("""
CREATE TABLE IF NOT EXISTS hangouts(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        activity TEXT NOT NULL, 
        hour TEXT NOT NULL, 
        minute TEXT NOT NULL, 
        maxAttendees INTEGER,
        attendees INTEGER DEFAULT 1, 
        location TEXT NOT NULL, 
        description TEXT
    )
""")   

con.commit()



@app.get('/hangouts')
def get_hangouts():
    cur = con.cursor() # cursor (worker) will now get the data from the SQL table
    cur.execute("SELECT * FROM hangouts") # returns list of tuples
    rows = cur.fetchall()

    return [dict(row) for row in rows]

@app.post('/hangouts')
def create_hangout(hangout: dict):

    cur = con.cursor()
    cur.execute("""
            INSERT INTO hangouts (activity, hour, minute, maxAttendees, location, description)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            hangout['activity'],
            hangout['hour'],
            hangout['minute'],
            hangout['maxAttendees'],
            hangout['location'],
            hangout.get('description', '')
            # no need for attendees because the default is one
        )
    )
    con.commit() # for safety and control, think of this like git commit
    
    # update to database and then give it to the frontend
    new_id = cur.lastrowid

    # fetch newly added hangout
    cur.execute("SELECT * FROM hangouts WHERE id = ?", (new_id,))
    new_hangout = dict(cur.fetchone())
    return new_hangout

@app.put("/hangouts/{id}")
def update_hangout(id: int, hangouts: dict):

    cur = con.cursor()
    cur.execute("""
            UPDATE hangouts 
            SET attendees = (?) 
            WHERE id = (?)
        """,
        ( 
            hangouts['attendees'],
            id
        )
    )
    con.commit()
    cur.execute('SELECT * FROM hangouts WHERE id = ?', (id,))
    updated_hangout = dict(cur.fetchone())
    # lastrowid, is id that database just created
    return updated_hangout


@app.delete('/hangouts/{id}')
def delete_hangout(id: int):
    cur = con.cursor()
    cur.execute("DELETE FROM hangouts WHERE id = ?", (id,))
    con.commit()

    return {"message": "Deleted", "id": id}