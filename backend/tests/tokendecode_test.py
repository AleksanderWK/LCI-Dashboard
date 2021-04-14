from tokendecode import decodeToken

def test_codes():
    with open("./tests/test_codes.txt") as f:
        lines = f.readlines()
        for code in lines:
            ip, random = decodeToken(code.strip())
            assert ip == "192.168.38.101"
            print(code.strip(), ip, ip == "192.168.38.101")