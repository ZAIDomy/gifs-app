import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  standalone: true,
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit{

  gifService = inject(GifsService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef= viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv)return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(event: Event){

    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv)return;
    
    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    const isAtBotom = scrollTop+clientHeight+250>=scrollHeight;

    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBotom) {
      this.gifService.loadTrendingGifs();
    }

  }
}
