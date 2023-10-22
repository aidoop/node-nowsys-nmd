import socket
import sys
import random

SEVER_IP = "localhost"
SERVER_PORT = 8000


def genValues(dict_data: dict, min, max):
    for dict_key in dict_data.keys():
        dict_data[dict_key] = random.randint(min, max)


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = (SEVER_IP, SERVER_PORT)
print(f"starting up on %s port {server_address}")
sock.bind(server_address)

sock.listen(1)


while True:
    # Wait for a connection
    print("waiting for a connection")
    connection, client_address = sock.accept()

    try:
        print(f"connection from {client_address}")

        # Receive the data in small chunks and retransmit it
        while True:
            data = connection.recv(10)
            print(f"received data: {data}")
            if data:
                print("received data: ", data)

                resp_data = bytes(
                    [
                        0x02,
                        0x00,
                        0x12,
                        0x35,
                        0x11,
                        0x22,
                        0x33,
                        0x44,
                        0x55,
                        0x66,
                        0x00,
                        0x01,
                        0xE2,
                        0x40,
                        0x67,
                        0x89,
                        0x03,
                        0x1C,
                    ]
                )
                connection.sendall(resp_data)

            else:
                print(f"no more data from {client_address}")
                break
    except Exception as ex:
        print("Exception: ", ex)

    finally:
        connection.close()
