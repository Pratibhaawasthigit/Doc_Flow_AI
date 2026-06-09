# Doc_Flow_AI Backend

This is the Spring Boot backend for the Doc_Flow_AI application.

## How to Run

Since Maven is not currently in your system path, you can run the application using the included Java command (assuming you have the JAR or want to build it manually), or install Maven to use `mvn spring-boot:run`.

### Quick Run (PowerShell)
I have created a `run.ps1` script in this directory to help you start the server.

```powershell
./run.ps1
```

The server will start on [http://localhost:8081](http://localhost:8081).
The frontend is configured to proxy `/api` requests to this address.
