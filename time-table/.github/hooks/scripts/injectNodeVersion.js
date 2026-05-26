const output = {
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: `Node.js version: ${process.version}`,
  },
};

process.stdout.write(JSON.stringify(output));