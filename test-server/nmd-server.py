import socket
import sys
import random

SEVER_IP = "0.0.0.0"
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
        product_quantity = 1000
        detection_quantity = 0

        while True:
            data = connection.recv(10)
            if data:
                print("received data: ", data)

                product_quantity = product_quantity + 1
                detection_quantity = detection_quantity + 1

                product_quantity_bytes = product_quantity.to_bytes(4, "big")
                detection_quantity_bytes = detection_quantity.to_bytes(2, "big")

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
                        product_quantity_bytes[0],
                        product_quantity_bytes[1],
                        product_quantity_bytes[2],
                        product_quantity_bytes[3],
                        detection_quantity_bytes[0],
                        detection_quantity_bytes[1],
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
