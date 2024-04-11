import {Controller, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {FeedService} from './feed.service';

@ApiTags('Feed')
@Controller({
	path: 'feed',
	version: '1',
})
export class FeedController {
	constructor(private readonly feedService: FeedService) {}

	@Get()
	async home() {
		return this.feedService.home();
	}
}
