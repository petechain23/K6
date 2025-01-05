export function teardown(data) {
    // Perform any cleanup actions
    if (data.creadential === null) {
        throw new Error('incorrect data: ' + JSON.stringify(data));
    } else {
    console.log('Test completed. Performing teardown.');
    }
}