import {Injectable} from '@nestjs/common';

@Injectable()
export class FeedService {
	async home() {
		return 'home';
	}
}
