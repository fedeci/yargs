/* global describe, it, beforeEach */
'use-strict';
const yargs = require('../index.cjs');
const {checkOutput} = require('./helpers/utils.cjs');

require('chai').should();

describe('FigCompletion', () => {
  beforeEach(() => {
    yargs.getInternalMethods().reset();
  });

  it('Generic CLI', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '$0 [foo]',
          'Do something',
          y => {
            return y
              .positional('foo', {
                desc: 'Some argument description',
                alias: 'f',
              })
              .command(
                'subcmd',
                'Some command description',
                y => {
                  return y.command(
                    'subsubcmd [arg]',
                    'Some nested description',
                    {
                      opt: {
                        alias: 'o',
                        number: true,
                      },
                    },
                    () => {}
                  );
                },
                () => {}
              );
          },
          () => {}
        )
        .command(
          ['start [app]', 'run', 'up'],
          'Start up an app',
          {
            name: {
              alias: 'n',
              string: true,
              hidden: true,
            },
          },
          argv => {
            console.log('starting up the', argv.app || 'default', 'app');
          }
        )
        .command({
          command: 'configure',
          aliases: ['config', 'cfg'],
          desc: 'Set a config variable',
          builder: y => {
            return y.command(
              'login <key> [value]',
              'Configure login to app',
              y => {
                return y.positional('value', {default: true});
              },
              () => {}
            );
          },
          handler: argv => {
            console.log(`setting ${argv.key} to ${argv.value}`);
          },
        })
        .figCompletion()
        .parse()
    );
    console.log(o);
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Do something",',
        '  "subcommands": [',
        '    {',
        '      "name": [',
        '        "subcmd"',
        '      ],',
        '      "description": "Some command description",',
        '      "subcommands": [',
        '        {',
        '          "name": [',
        '            "subsubcmd"',
        '          ],',
        '          "description": "Some nested description",',
        '          "options": [',
        '            {',
        '              "name": [',
        '                "--opt",',
        '                "-o"',
        '              ],',
        '              "args": [',
        '                {',
        '                  "name": "number"',
        '                }',
        '              ]',
        '            }',
        '          ],',
        '          "args": [',
        '            {',
        '              "name": "arg",',
        '              "isOptional": true',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--help"',
        '          ],',
        '          "description": "Show help"',
        '        },',
        '        {',
        '          "name": [',
        '            "--version"',
        '          ],',
        '          "description": "Show version number"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "start",',
        '        "run",',
        '        "up"',
        '      ],',
        '      "description": "Start up an app",',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--name",',
        '            "-n"',
        '          ],',
        '          "hidden": true,',
        '          "args": [',
        '            {',
        '              "name": "string"',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "app",',
        '          "isOptional": true',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "configure",',
        '        "config",',
        '        "cfg"',
        '      ],',
        '      "description": "Set a config variable",',
        '      "subcommands": [',
        '        {',
        '          "name": [',
        '            "login"',
        '          ],',
        '          "description": "Configure login to app",',
        '          "subcommands": [],',
        '          "options": [',
        '            {',
        '              "name": [',
        '                "--help"',
        '              ],',
        '              "description": "Show help"',
        '            },',
        '            {',
        '              "name": [',
        '                "--version"',
        '              ],',
        '              "description": "Show version number"',
        '            }',
        '          ],',
        '          "args": [',
        '            {',
        '              "name": "key"',
        '            },',
        '            {',
        '              "name": "value",',
        '              "isOptional": true,',
        '              "default": "true"',
        '            }',
        '          ]',
        '        }',
        '      ],',
        '      "options": [',
        '        {',
        '          "name": [',
        '            "--help"',
        '          ],',
        '          "description": "Show help"',
        '        },',
        '        {',
        '          "name": [',
        '            "--version"',
        '          ],',
        '          "description": "Show version number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "foo|f",',
        '      "isOptional": true,',
        '      "description": "Some argument description"',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });

  it('Options added under default builder and under default yargs instance', () => {
    const o = checkOutput(() =>
      yargs('generate-fig-spec')
        .command(
          '$0 [bar]',
          'Do something',
          yargs => {
            return yargs.option('other-opt', {
              default: 1,
              nargs: 3,
              type: 'number',
            });
          },
          () => {}
        )
        .option('opt', {default: 'foo', nargs: 3, type: 'string'})
        .figCompletion()
        .parse()
    );
    console.log(o);
    o.exitCode.should.equal(0);
    o.errors.length.should.equal(0);
    o.logs[0]
      .split('\n')
      .should.deep.equal([
        '// Autogenerated by the Yargs integration',
        '',
        'const completionSpec: Fig.Spec = {',
        '  "name": [',
        '    "usage"',
        '  ],',
        '  "description": "Do something",',
        '  "subcommands": [],',
        '  "options": [',
        '    {',
        '      "name": [',
        '        "--help"',
        '      ],',
        '      "description": "Show help"',
        '    },',
        '    {',
        '      "name": [',
        '        "--version"',
        '      ],',
        '      "description": "Show version number"',
        '    },',
        '    {',
        '      "name": [',
        '        "--opt"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "string"',
        '        },',
        '        {',
        '          "name": "string"',
        '        },',
        '        {',
        '          "name": "string"',
        '        }',
        '      ]',
        '    },',
        '    {',
        '      "name": [',
        '        "--other-opt"',
        '      ],',
        '      "args": [',
        '        {',
        '          "name": "number"',
        '        },',
        '        {',
        '          "name": "number"',
        '        },',
        '        {',
        '          "name": "number"',
        '        }',
        '      ]',
        '    }',
        '  ],',
        '  "args": [',
        '    {',
        '      "name": "bar",',
        '      "isOptional": true',
        '    }',
        '  ]',
        '};',
        '',
        'export default completionSpec;',
        '',
      ]);
  });
});