import { DirectusInstance, expectDirectusError, getSetupTimeout } from './sdk';

describe('Sample test', () => {
    const instance = new DirectusInstance('sample-test');
    const directus = instance.getDirectusClient();

    beforeAll(async () => {
        await instance.start();
        await directus.loginAsAdmin();
    }, getSetupTimeout());
    afterAll(async () => {
        await instance.stop();
    }, getSetupTimeout());

    it('should be able to create an user', async () => {
        const user = await directus.createUser('one', {
            first_name: 'One First Name',
        });

        expect(user.first_name).toEqual('One First Name');
    });

    it('should not be able to create a user with the same email', async () => {
        await expectDirectusError(
            directus.createUser('one'),
            `Value for field "email" in collection "directus_users" has to be unique.`,
        );
    });

});
