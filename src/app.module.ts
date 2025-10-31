import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';



@Module({
  imports: [
    ProductModule,
    CommentModule,
    UserModule,
    AuthModule,
    OrdersModule,
    MailModule,
    OtpModule],
  providers: [MailService],
})
export class AppModule {}

