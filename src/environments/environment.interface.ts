/**
 * This interface defines the structure of the ENV variable
 * When updating the content of the ENV variable, this interface should be updated before anything else.
 * This way, the project build should fail if you forgot to update any environment file or the interface of the EnvService.
 */
interface EnvInterface {
  backendUrl: string;
  environment: string;
}

export default EnvInterface;