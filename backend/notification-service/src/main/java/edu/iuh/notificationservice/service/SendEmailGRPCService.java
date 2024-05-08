package edu.iuh.notificationservice.service;

import edu.iuh.RegisterFormRequest;
import edu.iuh.RegisterFormResponse;
import edu.iuh.SendEmailServiceGrpc;
import edu.iuh.notificationservice.entity.MailStructure;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.text.NumberFormat;
import java.util.Locale;

@GrpcService
@Slf4j
public class SendEmailGRPCService extends SendEmailServiceGrpc.SendEmailServiceImplBase {
    private final MailService mailService;

    public SendEmailGRPCService(MailService mailService) {
        this.mailService = mailService;
    }

    @Override
    public void registerFormSuccess(RegisterFormRequest request, StreamObserver<RegisterFormResponse> responseObserver) {
        log.info("### register form success ###");
        long tuitionFee = request.getTuitionFee();

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        String tuitionFeeFormatted = currencyFormat.format(tuitionFee);

        String message = "Chào bạn,\n\n" +
                "Chúc mừng! Bạn đã đăng ký môn học thành công!\n\n" +
                "Dưới đây là thông tin đăng ký của bạn:\n" +
                "- Mã sinh viên: " + request.getStudentID() + "\n" +
                "- Môn học: " + request.getSubjectName() + "\n" +
                "- Mã đăng ký: " + request.getRegisterFormID() + "\n" +
                "- Học phí: " + tuitionFeeFormatted + "\n\n" +
                "Chúc bạn có một kỳ học vui vẻ và thành công!\n\n" +
                "Trân trọng,\n" +
                "Ban quản lý đăng ký";

        String subject = "DKHP SUCCESS";


        MailStructure mailStructure = new MailStructure(request.getGmail(), subject, message);
        mailService.sendEmail(mailStructure);

        responseObserver.onNext(
                RegisterFormResponse.newBuilder().build()
        );
        responseObserver.onCompleted();
    }
}

