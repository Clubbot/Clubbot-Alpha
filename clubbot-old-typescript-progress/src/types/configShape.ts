import ow from "ow";

export default ow.object.exactShape({
  token: ow.string.nonEmpty,
  prefix: ow.string.nonEmpty,
  status: {
    message: ow.string.nonEmpty,
    type: ow.string.nonEmpty
  },
  ownerID: ow.string.nonEmpty
});