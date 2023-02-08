import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { artist_card } from 'src/app/models/artist_card';
import { artist_detail } from 'src/app/models/artist_detail';
import { artwork_card } from 'src/app/models/artwork_card';
import { gene } from 'src/app/models/gene';

declare var window: any;

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {

  constructor(private http: HttpClient) { }
  
  @Input() userInput?: String;
  url = "http://localhost:4000"
  artists: artist_card[] = [];
  empty: artist_card[] = [];
  selected_detail = {} as artist_detail;
  artwork_cards: artwork_card[] = [];
  genes: gene[] = [];
  popModal:any;
  selected_artwork:artwork_card = {} as artwork_card;

  search_artist() {
    this.clearAll()
    var searchSpin = document.getElementById('search_spin');
    searchSpin?.classList.remove('d-none')
    searchSpin?.classList.add('d-block')
    var no_res = document.getElementById("no-list")!;
    if(no_res.classList.contains('d-flex')) {
      no_res.classList.remove('d-flex');
      no_res.classList.add('d-none'); 
  }
    var res_list = document.getElementById("results")!;
    var backUrl = this.url + '/search?q=' + this.userInput;
     this.http.get(backUrl).subscribe((result:any) => {
      searchSpin?.classList.remove('d-block')
      searchSpin?.classList.add('d-none')
      var list = result._embedded.results;
      var indices = this.locateIndex(list);
      if (indices.length == 0) {
          
          if(!res_list.classList.contains('d-none')) {
            res_list.classList.remove('d-flex');
            res_list.classList.add('d-none'); 
          }
          if(!no_res.classList.contains('d-flex')) {
              no_res.classList.remove('d-none');
              no_res.classList.add('d-flex'); 
          }

      } else {
          this.artists = [];
          var chose = false;
          if(!res_list.classList.contains('d-flex')) {
            res_list.classList.remove('d-none');
            res_list.classList.add('d-flex'); 
          }
          if (!no_res.classList.contains('d-none')) {
              no_res.classList.remove('d-flex');
              no_res.classList.add('d-none'); 
          }
          for (let i = 0; i < list.length; i++) {
            if (list[i].og_type == "artist") {
              var id = list[i]._links.self.href;
              id = id.replace('https://api.artsy.net/api/artists/', '');
              var link = list[i]._links.thumbnail.href;
              if (link == "/assets/shared/missing_image.png") {
                link = "../../../assets/artsy_logo.svg"
              }
              var name = list[i].title;
              this.addCard(id, name, link);
            }
          }
      }
     });
  }

  locateIndex(search_res:any) {
    var num = [];
    if (search_res.length > 0) {
        for (let i=0; i<search_res.length; i++) {
            var atResults = search_res[i];
            if (atResults.og_type == 'artist') {
                num.push(i)
            }
        }
    }  
    return num;
  }


  addCard(id_num:string, title:string, img_url:string) {
    this.artists.push({
      id:id_num,
      name: title,
      img: img_url
    })
  } 

  

  select_artist(id:string) {
    var lowerSpin = document.getElementById('lower_spin');
    var tabs = document.getElementById('tabs');
    tabs?.classList.remove('d-block');
    tabs?.classList.add('d-none');
    lowerSpin?.classList.remove('d-none')
    lowerSpin?.classList.add('d-flex')
    var cards = document.getElementsByClassName('artist_card');
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains('clicked')) {
        cards[i].classList.remove('clicked');
      }
    }
    var selected = document.getElementById(id)!;
    selected.classList.add('clicked');
    this.get_detail(id);
    this.get_artwork(id);

  }

  get_detail(id:string) {
    var tabs = document.getElementById('tabs');
    var backUrl = this.url + '/detail?id=' + id;
    this.http.get(backUrl).subscribe((result:any) => {
    var lowerSpin = document.getElementById('lower_spin');
    lowerSpin?.classList.remove('d-flex')
    lowerSpin?.classList.add('d-none')
    tabs?.classList.remove('d-none')
    tabs?.classList.add('d-block')
    
      var title = result.name;
      var birthday = '';
      if (result.hasOwnProperty('birthday')) {
          birthday = result.birthday;
      }
      var deathday = '';
      if (result.hasOwnProperty('deathday')) {
          deathday = result.deathday;
      }
      var nationality = '';
      if (result.hasOwnProperty('nationality')) {
          nationality = result.nationality;
      }
      var biography = '';
      if (result.hasOwnProperty('biography')) {
          biography = result.biography;
      }
      console.log(title + birthday + deathday +nationality)
      this.selected_detail = {
        Name: title,
        birthday: birthday,
        deathday: deathday,
        nation: nationality,
        biography: biography
      };
    });
  }

  get_artwork(id:string) {
    var artwork_alert = document.getElementById('no-artwork');
    artwork_alert?.classList.remove('d-block');
    artwork_alert?.classList.add('d-none')
    var backUrl = this.url + '/artworks?id=' + id;
    this.http.get(backUrl).subscribe((result:any) => {
      var artwork_arr = result._embedded.artworks;
      var num = result._embedded.artworks.length;

      if (num == 0) {
        this.artwork_cards = [];
        artwork_alert?.classList.remove('d-none');
        artwork_alert?.classList.add('d-block');
      } else {
        this.artwork_cards = [];
        for (let i = 0 ; i < num; i++) {
          this.addArtwork(artwork_arr[i].id, artwork_arr[i].title, artwork_arr[i].date, artwork_arr[i]._links.thumbnail.href);
        }
      }
    });
  }

  getGenes(artwork_index:number) {
    this.genes = [];
    this.selected_artwork = this.artwork_cards[artwork_index];
    var artwork_id = this.selected_artwork.id;
    this.popModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.openModal();
    var backUrl = this.url + '/genes?id=' + artwork_id;
    this.http.get(backUrl).subscribe((result:any) => {
      var list = result._embedded.genes;
      if (list.length == 0) {
        this.genes = [];
      } else {
        for (let i = 0; i < list.length; i++) {
          this.addGene(list[i].name, list[i]._links.thumbnail.href);
        }
      }
    })
  }

  openModal() {
    this.popModal.show();
  }

  hideModal() {
    this.popModal.hide();
  }

  addGene(Name:string, img:string) {
    this.genes.push({
      Name:Name,
      img:img
    })
  }
  
  addArtwork(id_num:string, title:string, date:string, link:string) {
    this.artwork_cards.push({
      id:id_num,
      title:title,
      date:date,
      link:link
    })
  }

  clearAll() {
    document.getElementById('results')?.classList.remove('d-flex')
    document.getElementById('results')?.classList.add('d-none')
    document.getElementById('tabs')?.classList.remove('d-block')
    document.getElementById('tabs')?.classList.add('d-none')
    this.artists = [];
    this.empty = [];
    this.selected_detail = {} as artist_detail;
    this.artwork_cards = [];
    this.genes = [];
    this.selected_artwork = {} as artwork_card;
  }

  ngOnInit(): void {
  }

}
