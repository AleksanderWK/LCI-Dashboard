from baseconv import base36
import ipaddress


def ip2int(addr):
    return int(ipaddress.IPv4Address(addr))


def int2ip(addr):
    return str(ipaddress.IPv4Address(addr))


def decodeToken(token):
    num_code = base36.decode(token)
    random_code = num_code[0] + num_code[-1]
    ip_num = int(num_code[1:-1])
    ip_address = int2ip(ip_num)
    return ip_address, random_code


print(decodeToken("bwawnqn6"))
