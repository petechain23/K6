// v2/teardown.js (Example)
export function teardown(data) {
    console.log("Executing global teardown tasks (if any)...");
    // Example: Clean up resources created during setup or test
    // 'data' contains the data returned by setup()
    // console.log("Global config from setup:", data.globalConfig);
  }
  