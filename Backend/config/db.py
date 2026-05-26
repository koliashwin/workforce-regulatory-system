import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name='wrs_pool',
    pool_size=5,
    pool_reset_session=True,
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASS'),
    database=os.getenv('DB_NAME')
)

def get_db_connection():
    # connection = mysql.connector.connect(
    #     host = os.getenv('DB_HOST'),
    #     port = os.getenv('DB_PORT'),
    #     user = os.getenv('DB_USER'),
    #     password = os.getenv('DB_PASS'),
    #     database=os.getenv('DB_NAME')
    # )
    return _pool.get_connection()