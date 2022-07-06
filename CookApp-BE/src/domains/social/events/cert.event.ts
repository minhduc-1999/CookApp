import { Certificate } from "../certificate.domain"

export class CertConfimredEvent {
  cert: Certificate
  constructor(cert: Certificate) {
    this.cert = cert
  }
}

export class CertRejectedEvent {
  cert: Certificate
  constructor(cert: Certificate) {
    this.cert = cert
  }
}
