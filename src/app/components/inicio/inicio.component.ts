import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PhotoService } from 'src/app/demo/service/photo.service';

import html2canvas from 'html2canvas';
@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
    images: any[] | undefined;

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    constructor(private photoService: PhotoService, public router: Router) {}

    ngOnInit() {
        this.photoService.getImages().then((images) => {
            this.images = images;
        });
        
    }
}
