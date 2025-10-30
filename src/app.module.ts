import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ProductModule,
    CommentModule,
    UserModule],
})
export class AppModule {}

