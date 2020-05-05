class ConfigurationResult {
  constructor(public device: string | null, public configured: boolean, public error?: string) {
    this.error = !error ? '' : error;
  }
}

export default ConfigurationResult;
