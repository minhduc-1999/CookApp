import { Badge } from "@chakra-ui/react";
import { CertificateStatus } from "apis/base.type";

type Props = {
  status: CertificateStatus;
};

const CertificateStatusTag = (props: Props) => {
  const { status } = props;
  let colorScheme: string = "black";
  if (status === CertificateStatus.WAITING) colorScheme = "yellow";
  if (status === CertificateStatus.REJECTED) colorScheme = "red";
  if (status === CertificateStatus.CONFIRMED) colorScheme = "green";
  return (
    <Badge  colorScheme={colorScheme} fontSize="0.5em">
      {status.toUpperCase()}
    </Badge>
  );
};
export default CertificateStatusTag;
