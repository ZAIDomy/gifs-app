import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page',
  standalone: true,
/*   imports: [GifsListComponent], */
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {

  gifService=inject(GifsService);

  scrollDivRef= viewChild<ElementRef<HTMLDivElement>>('groupDiv')

  onScroll(event: Event){

    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv)return;
    
    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    /* console.log({scrollTotal: scrollTop +  clientHeight, scrollHeight}); */

    const isAtBotom = scrollTop+clientHeight+250>=scrollHeight;

    console.log({isAtBotom});

  }
}
