from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import os

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# MySQL connection config — override via environment variables in production
# ---------------------------------------------------------------------------
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "evdb.ckp4koyskic0.us-east-1.rds.amazonaws.com"),
    "user": os.environ.get("DB_USER", "admin"),
    "password": os.environ.get("DB_PASSWORD", "admin123"),
}
DB_NAME = os.environ.get("DB_NAME", "evdb")


def get_root_connection():
    """Connection without selecting a database — used to create the DB itself."""
    return mysql.connector.connect(**DB_CONFIG)


def setup_database():
    """Creates the database, table, and seeds original data if empty."""
    conn = get_root_connection()
    cursor = conn.cursor()

    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` "
        f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )
    cursor.execute(f"USE `{DB_NAME}`")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stations (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            district    VARCHAR(100) NOT NULL,
            location    VARCHAR(150) NOT NULL,
            station     VARCHAR(200) NOT NULL,
            address     VARCHAR(255) NOT NULL,
            ports       INT NOT NULL DEFAULT 0,
            available   INT NOT NULL DEFAULT 0,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_district (district)
        )
    """)
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM stations")
    (count,) = cursor.fetchone()

    if count == 0:
        seed_data = [
            ("Chennai", "Anna Nagar", "Anna Nagar EV Hub", "2nd Avenue", 8, 6),
            ("Chennai", "T Nagar", "T Nagar Fast Charge", "North Usman Road", 5, 1),
            ("Chennai", "Velachery", "Velachery EV Point", "100 Feet Road", 8, 2),
            ("Coimbatore", "Gandhipuram", "Coimbatore EV Hub", "Cross Cut Road", 5, 2),
            ("Coimbatore", "RS Puram", "RS Puram Charge", "DB Road", 8, 6),
            ("Madurai", "Mattuthavani", "Madurai EV Hub", "Bus Stand", 5, 3),
            ("Madurai", "KK Nagar", "KK Nagar Charge", "Main Road", 8, 2),
            ("Salem", "Hasthampatti", "Salem EV Hub", "Hasthampatti Main Road", 5, 4),
            ("Salem", "Fairlands", "Fairlands Charge", "Fairlands Road", 8, 6),
            ("Tiruchirappalli", "Srirangam", "Trichy EV Hub", "Srirangam", 5, 5),
            ("Tiruchirappalli", "Thillai Nagar", "Thillai Nagar Charge", "11th Cross", 8, 2),
            ("Erode", "Perundurai", "Erode EV Hub", "NH544", 5, 1),
            ("Erode", "Erode Town", "Erode Town Charge", "Brough Road", 8, 6),
            ("Vellore", "Katpadi", "Vellore EV Hub", "Katpadi Junction", 5, 2),
            ("Vellore", "Vellore Town", "Vellore Fort Charge", "Fort Road", 8, 2),
            ("Tirunelveli", "Palayamkottai", "Nellai Charge Point", "High Ground", 5, 3),
            ("Tirunelveli", "Tirunelveli Town", "Tirunelveli Town Charge", "Trivandrum Road", 8, 6),
            ("Thoothukudi", "Millerpuram", "Tuticorin EV Hub", "Beach Road", 5, 4),
            ("Thoothukudi", "Thoothukudi Town", "Thoothukudi Town Charge", "Bypass Road", 8, 2),
            ("Thanjavur", "Thanjavur Town", "Thanjavur EV Hub", "Trichy Road", 5, 5),
            ("Thanjavur", "Kumbakonam", "Kumbakonam Charge Point", "TSR Big Street", 8, 6),
            ("Ariyalur", "Ariyalur Town", "Ariyalur EV Hub", "Trichy Main Road", 5, 1),
            ("Ariyalur", "Jayankondam", "Jayankondam Charge Point", "Main Bazaar Road", 8, 2),
            ("Chengalpattu", "Chengalpattu Town", "Chengalpattu EV Hub", "GST Road", 5, 2),
            ("Chengalpattu", "Mahabalipuram", "Mahabalipuram Charge Point", "ECR Road", 8, 6),
            ("Cuddalore", "Cuddalore Town", "Cuddalore EV Hub", "Beach Road", 5, 3),
            ("Cuddalore", "Chidambaram", "Chidambaram Charge Point", "Temple East Street", 8, 2),
            ("Dharmapuri", "Dharmapuri Town", "Dharmapuri EV Hub", "Salem Main Road", 5, 4),
            ("Dharmapuri", "Palacode", "Palacode Charge Point", "Bengaluru Road", 8, 6),
            ("Dindigul", "Dindigul Town", "Dindigul EV Hub", "Trichy Road", 5, 5),
            ("Dindigul", "Palani", "Palani Charge Point", "Temple Approach Road", 8, 2),
            ("Kallakurichi", "Kallakurichi Town", "Kallakurichi EV Hub", "Salem Main Road", 5, 1),
            ("Kallakurichi", "Ulundurpet", "Ulundurpet Charge Point", "Trichy Road", 8, 6),
            ("Kanchipuram", "Kanchipuram Town", "Kanchipuram EV Hub", "Gandhi Road", 5, 2),
            ("Kanchipuram", "Sriperumbudur", "Sriperumbudur Charge Point", "NH48", 8, 2),
            ("Kanyakumari", "Nagercoil", "Nagercoil EV Hub", "Town Main Road", 5, 3),
            ("Kanyakumari", "Kanyakumari Town", "Kanyakumari Charge Point", "Beach Road", 8, 6),
            ("Karur", "Karur Town", "Karur EV Hub", "Trichy Road", 5, 4),
            ("Karur", "Kulithalai", "Kulithalai Charge Point", "Main Bazaar", 8, 2),
            ("Krishnagiri", "Krishnagiri Town", "Krishnagiri EV Hub", "Bengaluru Road", 5, 5),
            ("Krishnagiri", "Hosur", "Hosur Charge Point", "Bengaluru Highway", 8, 6),
            ("Mayiladuthurai", "Mayiladuthurai Town", "Mayiladuthurai EV Hub", "Main Bazaar", 5, 1),
            ("Mayiladuthurai", "Sirkazhi", "Sirkazhi Charge Point", "Temple Street", 8, 2),
            ("Nagapattinam", "Nagapattinam Town", "Nagapattinam EV Hub", "Beach Road", 5, 2),
            ("Nagapattinam", "Velankanni", "Velankanni Charge Point", "Church Road", 8, 6),
            ("Namakkal", "Namakkal Town", "Namakkal EV Hub", "Salem Main Road", 5, 3),
            ("Namakkal", "Rasipuram", "Rasipuram Charge Point", "Trichy Road", 8, 2),
            ("Nilgiris", "Ooty", "Ooty Hill Charge", "Commercial Road", 5, 4),
            ("Nilgiris", "Coonoor", "Coonoor EV Point", "Mount Road", 8, 6),
            ("Perambalur", "Perambalur Town", "Perambalur EV Hub", "Trichy Main Road", 5, 5),
            ("Perambalur", "Kunnam", "Kunnam Charge Point", "Ariyalur Road", 8, 2),
            ("Pudukkottai", "Pudukkottai Town", "Pudukkottai EV Hub", "Trichy Road", 5, 1),
            ("Pudukkottai", "Aranthangi", "Aranthangi Charge Point", "Main Bazaar", 8, 6),
            ("Ramanathapuram", "Ramanathapuram Town", "Ramanathapuram EV Hub", "Madurai Road", 5, 2),
            ("Ramanathapuram", "Rameswaram", "Rameswaram Charge Point", "Temple East Road", 8, 2),
            ("Ranipet", "Ranipet Town", "Ranipet EV Hub", "Chennai-Bengaluru Highway", 5, 3),
            ("Ranipet", "Arcot", "Arcot Charge Point", "Fort Road", 8, 6),
            ("Sivaganga", "Sivaganga Town", "Sivaganga EV Hub", "Madurai Road", 5, 4),
            ("Sivaganga", "Karaikudi", "Karaikudi Charge Point", "Chettinad Road", 8, 2),
            ("Tenkasi", "Tenkasi Town", "Tenkasi EV Hub", "Courtallam Road", 5, 5),
            ("Tenkasi", "Shencottai", "Shencottai Charge Point", "Main Bazaar", 8, 6),
            ("Theni", "Theni Town", "Theni EV Hub", "Madurai Road", 5, 1),
            ("Theni", "Bodinayakanur", "Bodinayakanur Charge Point", "Cumbum Road", 8, 2),
            ("Tirupathur", "Tirupathur Town", "Tirupathur EV Hub", "Vellore Road", 5, 2),
            ("Tirupathur", "Vaniyambadi", "Vaniyambadi Charge Point", "Leather Complex Road", 8, 6),
            ("Tiruppur", "Tiruppur Town", "Tiruppur EV Hub", "Avinashi Road", 5, 3),
            ("Tiruppur", "Avinashi", "Avinashi Charge Point", "Coimbatore Road", 8, 2),
            ("Tiruvallur", "Tiruvallur Town", "Tiruvallur EV Hub", "Chennai-Tirupati Road", 5, 4),
            ("Tiruvallur", "Ponneri", "Ponneri Charge Point", "Main Bazaar", 8, 6),
            ("Tiruvannamalai", "Tiruvannamalai Town", "Tiruvannamalai EV Hub", "Chennai Road", 5, 5),
            ("Tiruvannamalai", "Polur", "Polur Charge Point", "Trichy Road", 8, 2),
            ("Tiruvarur", "Tiruvarur Town", "Tiruvarur EV Hub", "Thanjavur Road", 5, 1),
            ("Tiruvarur", "Mannargudi", "Mannargudi Charge Point", "Big Street", 8, 6),
            ("Viluppuram", "Viluppuram Town", "Viluppuram EV Hub", "Trichy Main Road", 5, 2),
            ("Viluppuram", "Tindivanam", "Tindivanam Charge Point", "Chennai-Trichy Road", 8, 2),
            ("Virudhunagar", "Virudhunagar Town", "Virudhunagar EV Hub", "Madurai Road", 5, 3),
            ("Virudhunagar", "Sivakasi", "Sivakasi Charge Point", "Fireworks Complex Road", 8, 6),
        ]
        cursor.executemany(
            """INSERT INTO stations (district, location, station, address, ports, available)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            seed_data,
        )
        conn.commit()
        print(f"Seeded {cursor.rowcount} stations.")

    cursor.close()
    conn.close()


# Run setup once at startup (creates DB/table, seeds if empty)
setup_database()

# Connection pool used by every request
db_pool = pooling.MySQLConnectionPool(
    pool_name="ev_pool",
    pool_size=5,
    database=DB_NAME,
    **DB_CONFIG,
)


def get_connection():
    return db_pool.get_connection()


def row_to_dict(cursor, row):
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/")
def home():
    return jsonify("EV Charging Station API Running")


@app.route("/stations", methods=["GET"])
def get_stations():
    district = request.args.get("district")
    conn = get_connection()
    cursor = conn.cursor()
    try:
        if district and district != "All":
            cursor.execute(
                "SELECT * FROM stations WHERE LOWER(district) = LOWER(%s)",
                (district,),
            )
        else:
            cursor.execute("SELECT * FROM stations")
        rows = cursor.fetchall()
        return jsonify([row_to_dict(cursor, row) for row in rows])
    finally:
        cursor.close()
        conn.close()


@app.route("/stations/<int:station_id>", methods=["GET"])
def get_station(station_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM stations WHERE id = %s", (station_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Station not found"}), 404
        return jsonify(row_to_dict(cursor, row))
    finally:
        cursor.close()
        conn.close()


@app.route("/stations", methods=["POST"])
def add_station():
    data = request.get_json(silent=True) or {}
    required = ["district", "location", "station", "address", "ports", "available"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if not (0 <= data["available"] <= data["ports"]):
        return jsonify({"error": "available must be between 0 and ports"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO stations (district, location, station, address, ports, available)
               VALUES (%(district)s, %(location)s, %(station)s, %(address)s, %(ports)s, %(available)s)""",
            data,
        )
        conn.commit()
        return jsonify({"id": cursor.lastrowid, **data}), 201
    except mysql.connector.Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()


@app.route("/stations/<int:station_id>", methods=["PUT", "PATCH"])
def update_station(station_id):
    data = request.get_json(silent=True) or {}
    allowed = {"district", "location", "station", "address", "ports", "available"}
    updates = {k: v for k, v in data.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    set_clause = ", ".join(f"{field} = %({field})s" for field in updates)
    updates["id"] = station_id

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"UPDATE stations SET {set_clause} WHERE id = %(id)s", updates)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Station not found"}), 404
        return jsonify({"message": "Station updated", "id": station_id, **updates})
    except mysql.connector.Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()


@app.route("/stations/<int:station_id>", methods=["DELETE"])
def delete_station(station_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM stations WHERE id = %s", (station_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Station not found"}), 404
        return jsonify({"message": "Station deleted", "id": station_id})
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

