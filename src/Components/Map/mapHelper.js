export const CheckoutStatus = {
  MarketingExecutive: 1,
  BranchManager: 2,
  Done: 3,
  ExecutiveConfirmation: 4,
  Preparing: 5,
  ReChecking: 6,
  SampleChecking: 7,
  Dispatch: 8,
  Loading: 9,
  LoadingDetailConfirmation: 10,
  HandOverToCustomer: 11,
  ExecutiveChangeConfirmation: 12,
  ToBeSettled: 13,
  ReturnStock: 14,
  CallCenterConfirmation: 15,
};

export function getKeyByValue(value) {
  return Object.keys(CheckoutStatus).find(
    (key) => CheckoutStatus[key] === value
  );
}
