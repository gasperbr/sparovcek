import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  Stanje = Stanje
  stanje: Stanje = Stanje.GlavnaStran

  zgodovina = [];

  strankaDefault = {
    ime: "",
    priimek: "",
    geslo: "",
    valid: function() {
      return !!this.ime && !!this.priimek && !!this.geslo;
    }
  }

  hitraNakazilaArr = ["Plačaj žepnino"];

  nakaziloDefault = {
    znesek: 0.00,
    stRacuna1: "",
    stRacuna2: "",
    stRacuna3: "",
    stRacuna4: "",
    stRacuna: function() {
      return [this.stRacuna1, this.stRacuna2, this.stRacuna3, this.stRacuna4].join("")
    },
    veljavnaStRacuna: function() {
      console.log(this.stRacuna1.length,
        this.stRacuna2.length,
        this.stRacuna3.length,
        this.stRacuna4.length)
      return this.stRacuna1.length === 4 &&
        this.stRacuna2.length === 4 &&
        this.stRacuna3.length === 4 &&
        this.stRacuna4.length === 3;
    },
    valid: function() {
      return this.znesek > 0 && this.veljavnaStRacuna() && (!this.hitroNakazilo || !!this.imeNakazila);
    },
    hitroNakazilo: false,
    imeNakazila: ""
  }

  upnDefault = {
    znesek: 0.00,
    stRacuna1: "",
    stRacuna2: "",
    stRacuna3: "",
    stRacuna4: "",
    stRacuna: function() {
      return [this.stRacuna1, this.stRacuna2, this.stRacuna3, this.stRacuna4].join("")
    },
    veljavnaStRacuna: function() {
      return this.stRacuna1.length === 4 &&
        this.stRacuna2.length === 4 &&
        this.stRacuna3.length === 4 &&
        this.stRacuna4.length === 3;
    },
    referenca1: "",
    referenca2: "",
    referenca: function() {
      return [this.referenca1, this.referenca2].join("")
    },
    veljavnaReferenca: function() {
      return this.referenca1.length === 4 && this.referenca2.length > 0;
    },
    naziv:"",
    naslov:"",
    osebniZaznamek: "",
    valid: function() {
      return this.znesek > 0 && this.veljavnaStRacuna() && this.veljavnaReferenca() && !!this.naziv && !!this.naslov && !!this.naslov && !! this.osebniZaznamek;
    }
  }

  poloznica = {...this.upnDefault};
  stranka = {...this.strankaDefault};
  nakazilo = {...this.nakaziloDefault};
  showErrors = false;
  placiloIzvedeno = false;

  constructor(
    private electronService: ElectronService,
  ) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  jePrijavljena() {
    return !!this.stranka.valid();
  }

  prijava() {
    this.showErrors = true;
    if (this.stranka.valid()) {
      this.stanje = Stanje.GlavnaStran;
      this.showErrors = false;
    }
  }

  odjava() {
    this.stranka = {...this.strankaDefault};
    this.resetPoloznice();
    this.nakazilo = {... this.nakaziloDefault};
    this.zgodovina = [];
  }

  backToMain() {
    this.stanje = Stanje.GlavnaStran;
    this.showErrors = false;
  }
  
  resetPoloznice() {
    this.poloznica = {...this.upnDefault};
    this.showErrors = false;
  }

  upn() {
    this.stanje = Stanje.Upn;
  }

  goToNakazilo() {
    this.stanje = Stanje.Nakazilo;
  }

  payUPN() {
    this.showErrors = true;
    if (this.poloznica.valid()) {
      this.placiloIzvedeno = true;
      this.zgodovina.push(`Plačilo stroškov (${this.poloznica.znesek} €)`)
      this.showErrors = false;
      setTimeout(() => {
        this.placiloIzvedeno = false;
      }, 3000)
    }
  }

  resetNakazila() {
    this.nakazilo = {...this.nakaziloDefault};
    this.showErrors = false;
  }
  
  placajNakazilo() {
    this.showErrors = true;
    if (this.nakazilo.valid()) {
      this.placiloIzvedeno = true;
      if (this.nakazilo.hitroNakazilo) {
        this.hitraNakazilaArr.push(this.nakazilo.imeNakazila);
      }
      this.showErrors = false;
      this.zgodovina.push(`Nakazilo (${this.nakazilo.znesek} €)`)
      setTimeout(() => {
        this.placiloIzvedeno = false;
      }, 3000)
    }
  }

  selectedNakazilo
  setSomeNakazilo(val) {
    console.log(val)
    this.nakazilo = {
      ...this.nakaziloDefault,
      znesek: 100.12,
      stRacuna1: "SI56",
      stRacuna2: "1234",
      stRacuna3: "3456",
      stRacuna4: "789"
    }
  }

  pregledStanja() {
    this.stanje = Stanje.Stanje;
    this.zgodovina.push(`Pregled stanja`)
  }

}

enum Stanje {
  GlavnaStran, Avtentikacija, Upn, Nakazilo, Stanje
}