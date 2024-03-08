// Task 1
type AddressTypes = 'staking_program_id' | 'system_program_id' | 'locked_token_mint_id' | 'reward_token_mint_id';
type Address = string;
type Addresses<AddressTypes extends string = string> = Record<AddressTypes, Address | { address: AddressTypes }>;
// declare function addresses(data: Addresses<AddressTypes>): void;

// addresses({
// 	staking_program_id: "5XDdQrpNCD89LtrXDBk5qy4v1BW1zRCPyizTahpxDTcZ",
// 	system_program_id: "11111111111111111111111111111111",
// 	locked_token_mint_id: "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
//  reward_token_mint_id: { address: 'locked_token_mint_id' }
// });

// Task 2
type Entry<AddressTypes extends string = string> = {
  id: string,
  signer?: boolean,
  address?: AddressTypes
}
type Instruction<AddressTypes extends string = string> = {
  accounts: Entry<AddressTypes>[]
}
type Instructions<AddressTypes extends string = string> = Record<string, Instruction<AddressTypes>>;
type InstructionsInput<AddressTypes extends string = string> = {
  addresses: Addresses<AddressTypes>,
  instructions: Instructions<AddressTypes>
}

function getAddress<AddressTypes extends string>(addressID: AddressTypes, addresses: Addresses<AddressTypes>): Address {
  let address = addresses[addressID];
  if (typeof address === 'string') {
    return address;
  } else {
    return getAddress<AddressTypes>(address.address, addresses);
  }
}
function instructions<AddressTypes extends string>(data: InstructionsInput<AddressTypes>): Instructions<Address> {
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

// Task 3
let input = {
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
        { id: "another_no_address_id", signer: false },
				{ id: "system_program_id", address: "system_program_id" },
			],
		},
	}
} as const

type FilterAccounts<Accounts extends Entry[], Names extends string[] = []> =
  Accounts['length'] extends Names['length']
    ? Names
    : FilterAccounts<Accounts, [...Names, Accounts[Names['length']]['address'] extends string ? never : Accounts[Names['length']]['id']]>
type NoAddressKeys<Container, T extends string = string> = Container extends Instructions<T>
  ? {
    [K in keyof Container]: FilterAccounts<Container[K]['accounts']>
  }[keyof Container]
  : never

type DeepWritablePrimitive = undefined | null | boolean | string | number | Function;
type DeepWritable<T> =
    T extends DeepWritablePrimitive ? T :
    T extends Array<infer U> ? DeepWritableArray<U> : DeepWritableObject<T>;

type DeepWritableArray<T> = Array<DeepWritable<T>>;

type DeepWritableObject<T> = {
    -readonly [K in keyof T]: DeepWritable<T[K]>
};

type Task3ResultKeys = NoAddressKeys<DeepWritable<typeof input.instructions>>[number];
