from baseconv import base36
import ipaddress


def ip2int(addr):
    return int(ipaddress.IPv4Address(addr))


def int2ip(addr):
    return str(ipaddress.IPv4Address(addr))


def decodeToken(token):
    """
    The token is expected to be on the following format: base36(ripr).

    where r is a random number and ip is the ip address as an integer. 

    For example 84.210.220.141 is 1423105165 as integer and with random numbers 4 and 9 the token would be base36(414231051659)=5aamh11n

    To decode this kind of token we just go the opposite way.

    This function extracts the ip address and the random numbers from the token and returns it.
    """
    num_code = base36.decode(token)
    random_code = num_code[0] + num_code[-1]
    ip_num = int(num_code[1:-1])
    ip_address = int2ip(ip_num)
    return ip_address, random_code


print(decodeToken("48o05fod"))
