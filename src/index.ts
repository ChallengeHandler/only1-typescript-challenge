type AddressTypes = 'staking_program_id' | 'system_program_id' | 'locked_token_mint_id' | 'reward_token_mint_id';
type Addresses<AddressTypes extends string> = Record<AddressTypes, string | { address: AddressTypes }>;
declare function addresses(data: Addresses<AddressTypes>): void;

type Entry<AddressTypes extends string> = {
  id: string,
  signer?: boolean,
  address?: AddressTypes
}
type Instruction<AddressTypes extends string> = {
  accounts: Entry<AddressTypes>[]
}
type Instructions<AddressTypes extends string> = Record<string, Instruction<AddressTypes>>;
type InstructionsInput<AddressTypes extends string> = {
  addresses: Addresses<AddressTypes>,
  instructions: Instructions<AddressTypes>
}

addresses({
	staking_program_id: "5XDdQrpNCD89LtrXDBk5qy4v1BW1zRCPyizTahpxDTcZ",
	system_program_id: "11111111111111111111111111111111",
	locked_token_mint_id: "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
  reward_token_mint_id: { address: 'locked_token_mint_id' }
});

function getAddress<AddressTypes extends string>(addressID: AddressTypes, addresses: Addresses<AddressTypes>): string {
  let address = addresses[addressID];
  if (typeof address === 'string') {
    return address;
  } else {
    return getAddress<AddressTypes>(address.address, addresses);
  }
}
function instructions<AddressTypes extends string>(data: InstructionsInput<AddressTypes>): Instructions<string> {
  const addresses = data.addresses;
  const instructions = data.instructions;
  let result: Instructions<string> = {};
  for (const command of Object.keys(instructions)) {
    result[command].accounts = instructions[command].accounts.map(account => {
      if (account.address !== undefined) {
        return {
          ...account,
          address: getAddress(account.address, addresses)
        };
      } else {
        return account;
      }
    })
  }
  return result;
}

console.log(instructions({
	addresses: {
		staking_program_id: "5XDdQrpNCD89LtrXDBk5qy4v1BW1zRCPyizTahpxDTcZ",
		locked_token_mint_id: "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
		reward_token_mint_id: { address: "locked_token_mint_id" },
		system_program_id: "11111111111111111111111111111111",
	},
	instructions: {
		admin_init: {
			accounts: [
				{ id: "admin_id", signer: true },
				{ id: "program_id", address: "staking_program_id" },
				{ id: "locked_token_mint_id", address: "locked_token_mint_id" },
				{ id: "reward_token_mint_id", address: "reward_token_mint_id" },
				{ id: "system_program_id", address: "system_program_id" },
			],
		},
	}
}));