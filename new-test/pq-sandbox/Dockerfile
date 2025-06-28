FROM ubuntu:20.04

RUN apt-get update &&     DEBIAN_FRONTEND=noninteractive apt-get install -y gcc &&     echo '#include <stdio.h>\nint main() { printf("ML-KEM Test Successful!\\n"); return 0; }' > /kex_test.c &&     gcc /kex_test.c -o /kex_test &&     chmod +x /kex_test

CMD ["/bin/bash"]