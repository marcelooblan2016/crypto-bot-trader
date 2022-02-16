export {};

declare global {
    namespace Record {

        interface TokenInterface {
            tokenContracts (): tokenContractInterface[]
        }
    }

    namespace RecordMailer {
        interface sendParams {
            from: string,
            subject: string,
            message: string,
        }
    }
}