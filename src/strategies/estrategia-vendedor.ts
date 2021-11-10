import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {Keys} from '../config/keys';
const fetch = require('node-fetch');

export class EstrategiaVendedorStrategy implements AuthenticationStrategy {
  name: string = 'vendedor';

  constructor(

  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
      //Validarlo
      let rol_administrador = Keys.rol_administrador;
      let url_token = `${Keys.url_validar_token}?${Keys.arg_token}=${token}&${Keys.arg_rol_token}=${Keys.rol_vendedor}`;
      let r = ""
      await fetch(url_token)
        .then((res: any) => {
          let r = res.text();
        })
      switch (r) {
        case "OK":
          let perfil: UserProfile = Object.assign({
            admin: "OK"
          })
          return perfil;
          break;
        case "KO":
          throw new HttpErrors[401]("EL rol del token no es valido");
          break;
        case "":
          throw new HttpErrors[401]("EL toke no no es valido");
          break;
      }
    } else {
      throw new HttpErrors[401]("La request no tiene un token");
    }
  }


}
