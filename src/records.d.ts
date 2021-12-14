export {};

declare global {
    namespace Record {

        interface TokenInterface {
            tokenContracts (): tokenContractInterface[]
        }
    }
}