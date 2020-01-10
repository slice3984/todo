type ValidatorConfig = {
    input: string;
    isDate?: boolean;
    inFuture?: boolean;
    inPast?: boolean;
    today?: boolean;
    max?: number;
    min?: number;
};

export class Validator {
    // only statics
    private constructor() {}

    static validate(config: ValidatorConfig): boolean {
        for (const prop in config) {
            if (prop === 'isDate' && config[prop]) {
                if (!isNaN(new Date(config.input).getTime())) {
                    if (config.inFuture || config.inPast || config.today) {
                        if (config.inFuture) {
                            return new Date().getTime() - new Date(config.input).getTime() < 0
                        }

                        if (config.inPast) {
                            return new Date().getTime() - new Date(config.input).getTime() > 0
                        }

                        if (config.today) {
                            return new Date().toISOString().substring(0, 10) ===
                                   new Date(config.input).toISOString().substring(0, 10);
                        }
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            if (prop === 'max') {
                if (config['input'].length > config[prop]) {
                    return false;
                }
            }

            if (prop === 'min') {
                if (config['input'].length < config[prop]) {
                    return false;
                }
            }
        }
        return true;
    }
}