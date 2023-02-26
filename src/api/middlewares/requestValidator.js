import { formatJoiData } from "../../utils/helper";


export default (schema) => (req, res, next) => {
    const { body, params, query }  = req;
    const validations = schema.validate({...body,...params,...query});
    const { values, errors, isInValid } = formatJoiData(validations);
    if(isInValid) {
        return res.status(400).send(errors);
    }
    req.values = values;
    next();
}