# BACK END
## Init
### Import module
Cần cấu hình các `*-service` và `*-server` để IDE hiểu folder nào là module của dự án microservice.  <br>
Đề xuất: `File > Project Structure > Modules > + > Import Module > select folder`
### Run
Đầu tiên cần:
  - `build gragle` các service.
  - Có sẵn `docker`. <br>

Đầy đủ các yéue tố trên ta chạy file `backend/run_docker.bat`.

## Tổng Quan:
### Technologies Used
  - Reactive programming, Spring ecosystem, Webflux.
  - Eureka, Spring Cloud Discovery.
  - Reactve Mongo, PostpreSQL.
  - Restful api, gRPC.
  - Swagger, Docker.
### Architecture
![ach](https://github.com/sonnees/dkhp-iuh-edu-vn/assets/110987763/c15bbb40-2efc-4a67-8e9f-a8f16a6d1715)
