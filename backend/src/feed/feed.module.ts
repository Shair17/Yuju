import {Module} from '@nestjs/common';
import {FeedController} from './feed.controller';
import {FeedService} from './feed.service';

@Module({
	imports: [],
	controllers: [FeedController],
	providers: [FeedService],
	exports: [FeedService],
})
export class FeedModule {}
