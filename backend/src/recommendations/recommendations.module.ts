import {Module} from '@nestjs/common';
import {RecommendationsService} from './recommendations.service';
import {RecommendationsController} from './recommendations.controller';

@Module({
	controllers: [RecommendationsController],
	providers: [RecommendationsService],
	exports: [RecommendationsService],
})
export class RecommendationsModule {}
