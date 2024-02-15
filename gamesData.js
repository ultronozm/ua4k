let gamesData = {
    "game": {
        "boards": [
            [
                "-----",
                ">*--o",
                "-----"
            ],
            [
                "-----",
                ">-x*o",
                "-----"
            ],
            [
                "/---\\",
                "-----",
                "o----",
                ">*--/"
            ],
            [
                "o*-\\",
                "--/-",
                ">---"
            ],
            [
                "*--o",
                "\\-/-",
                "---<"
            ],
            [
                "o--x-",
                "x-\\-x",
                ">-*/-"
            ],
            [
                "x-o---",
                "x-x\\x-",
                ">-*/--",
                "x-----"
            ],
            [
                "x----",
                "-x-x-",
                "ox\\-x",
                ">-*/-"
            ],
            [
                "-x----",
                "oxx\\/-",
                "-x-*--",
                "------",
                ">-x---",
                "x---xx"
            ],
            [
                "-xx---",
                "oxx\\/-",
                "-x-*--",
                "------",
                ">-x---",
                "----xx"
            ],
            [
                "*--x--o",
                "-/---\\-",
                "--SUP--",
                ">\\---x-",
                "x--x--x"
            ],
            [
                "*-----",
                "-b--xx",
                ">---xo",
                "--b-xx",
                "------"
            ],
            [
                "----eeo",
                "-x--eee",
                ">---eee",
                "-------",
                "*--/-\\-",
                "-------",
                "_______",
                "HP:...-"
            ],
            [
                "x---eeex--o",
                "TRIVIAL-xx-",
                "*-x-eeeex--",
                "-/------ex-",
                "-e-/-\\-----",
                ">-e------xx",
                "___________",
                "HP:...-----"
            ],
            [
                "v--S-/-ox",
                "--\\T--eex",
                "x--A-xeex",
                "-\\-N\\--xx",
                "x--D--\\-x",
                "-e-A-b---",
                "-bxRxx-/-",
                "---De----",
                "xx*--x\\-x",
                "_________",
                "HP:...---"
            ],
            [
                "-------------",
                "-/---------\\-",
                "---eeeeeee---",
                "---eeeeeee---",
                "---ee-x-ee---",
                "---eexoxee---",
                "---ee-x-ee---",
                "---eeeeeee---",
                "---eeeeeee---",
                "-\\---------/-",
                "^-*----------",
                "_____________",
                "HP:..--------"
            ],
            [
                "--o---",
                "-/---\\",
                "eeeeee",
                "eeeeee",
                "------",
                "-/--\\-",
                "eeeeee",
                "eeeeee",
                "\\^*--/",
                "______",
                "HP:..."
            ],
            [
                "-----|---v-",
                "*-p--|---x-",
                "---x-|-q---",
                "-----|---o-"
            ],
            [
                "---------xx",
                ">---x----xo",
                "---xpx---xx",
                "----x------",
                "-----------",
                "SPECIALIZED",
                "-*---------",
                "-----------",
                "--x--q--b--",
                "-----------",
                "-b---------"
            ],
            [
                "/--*-o",
                "-q--EZ",
                "x---b-",
                "b-x-/-",
                "--\\-p-",
                ">-xx--"
            ],
            [
                ">---x-x-x-",
                "x-/x-x-x\\-",
                "-p--x-x-q-",
                "*o-x-x----"
            ],
            [
                "poeeeeeeeeeeeo",
                "-----x-x-x--OK",
                "xx*-x-/-/-x---",
                "xx---x-x-\\-\\--",
                ">---x-x-x-x--q",
                "______________",
                "HP:...--------"
            ],
            [
                "xxxxxoxxxxx",
                "-pxx-xxx-kx",
                "-l--xxq--xx",
                "/-b/--xx---",
                "*--b-xxeee-",
                "^-----xeex-",
                "___________",
                "KEYS:------",
                "HP:...-----"
            ],
            [
                "TNT----DET",
                "xxx--*---d",
                "xt------xx",
                "xxx----xxx",
                ">-----xxxo",
                "-b-----xxx",
                "--------xx"
            ]
        ],
        "rules": {
            "north": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "*",
                            "t"
                        ],
                        "to": [
                            "*",
                            "t",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "x",
                            "*"
                        ],
                        "to": [
                            "x",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "b",
                            "*"
                        ],
                        "to": [
                            "b",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "/",
                            "*"
                        ],
                        "to": [
                            "/",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "\\",
                            "*"
                        ],
                        "to": [
                            "\\",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "x",
                            "b",
                            "*"
                        ],
                        "to": [
                            "-",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": "hurt"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "h",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": "heal"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "k",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": "get_key"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "l",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": "use_key!"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "d",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": "detonate"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "p",
                            "x",
                            "*"
                        ],
                        "to": [
                            "p",
                            "x",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "q",
                            "x",
                            "*"
                        ],
                        "to": [
                            "q",
                            "x",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "p",
                                    "*"
                                ],
                                "to": [
                                    "p",
                                    "-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-",
                                            "q"
                                        ],
                                        "to": [
                                            "*",
                                            "q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e",
                                            "q"
                                        ],
                                        "to": [
                                            "*",
                                            "q"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "h",
                                            "q"
                                        ],
                                        "to": [
                                            "*",
                                            "q"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "k",
                                            "q"
                                        ],
                                        "to": [
                                            "*",
                                            "q"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "l",
                                            "q"
                                        ],
                                        "to": [
                                            "*",
                                            "q"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "d",
                                            "q"
                                        ],
                                        "to": [
                                            "*",
                                            "q"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "q",
                                    "*"
                                ],
                                "to": [
                                    "q",
                                    "-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-",
                                            "p"
                                        ],
                                        "to": [
                                            "*",
                                            "p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e",
                                            "p"
                                        ],
                                        "to": [
                                            "*",
                                            "p"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "h",
                                            "p"
                                        ],
                                        "to": [
                                            "*",
                                            "p"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "k",
                                            "p"
                                        ],
                                        "to": [
                                            "*",
                                            "p"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "l",
                                            "p"
                                        ],
                                        "to": [
                                            "*",
                                            "p"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "d",
                                            "p"
                                        ],
                                        "to": [
                                            "*",
                                            "p"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "p",
                                    "b",
                                    "*"
                                ],
                                "to": [
                                    "p",
                                    "*",
                                    "-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-",
                                            "q"
                                        ],
                                        "to": [
                                            "b",
                                            "q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "x",
                                            "q"
                                        ],
                                        "to": [
                                            "-",
                                            "q"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "q",
                                    "b",
                                    "*"
                                ],
                                "to": [
                                    "q",
                                    "*",
                                    "-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-",
                                            "p"
                                        ],
                                        "to": [
                                            "b",
                                            "p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "x",
                                            "p"
                                        ],
                                        "to": [
                                            "-",
                                            "p"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "south": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "t",
                            "*",
                            "-"
                        ],
                        "to": [
                            "-",
                            "t",
                            "*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "x",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "b",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "b"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "/",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "\\",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "\\"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "b",
                            "x"
                        ],
                        "to": [
                            "-",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "e"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": "hurt"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "h"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": "heal"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "k"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": "get_key"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "l"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": "use_key!"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "d"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": "detonate"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "x",
                            "p",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "x",
                            "p"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "x",
                            "q",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "x",
                            "q"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*",
                                    "p"
                                ],
                                "to": [
                                    "-",
                                    "p"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "-"
                                        ],
                                        "to": [
                                            "q",
                                            "*"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "e"
                                        ],
                                        "to": [
                                            "q",
                                            "*"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "h"
                                        ],
                                        "to": [
                                            "q",
                                            "*"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "k"
                                        ],
                                        "to": [
                                            "q",
                                            "*"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "l"
                                        ],
                                        "to": [
                                            "q",
                                            "*"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "d"
                                        ],
                                        "to": [
                                            "q",
                                            "*"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*",
                                    "q"
                                ],
                                "to": [
                                    "-",
                                    "q"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "-"
                                        ],
                                        "to": [
                                            "p",
                                            "*"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "e"
                                        ],
                                        "to": [
                                            "p",
                                            "*"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "h"
                                        ],
                                        "to": [
                                            "p",
                                            "*"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "k"
                                        ],
                                        "to": [
                                            "p",
                                            "*"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "l"
                                        ],
                                        "to": [
                                            "p",
                                            "*"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "d"
                                        ],
                                        "to": [
                                            "p",
                                            "*"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*",
                                    "b",
                                    "p"
                                ],
                                "to": [
                                    "-",
                                    "*",
                                    "p"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "-"
                                        ],
                                        "to": [
                                            "q",
                                            "b"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "x"
                                        ],
                                        "to": [
                                            "q",
                                            "-"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*",
                                    "b",
                                    "q"
                                ],
                                "to": [
                                    "-",
                                    "*",
                                    "q"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "-"
                                        ],
                                        "to": [
                                            "p",
                                            "b"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "x"
                                        ],
                                        "to": [
                                            "p",
                                            "-"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "west": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-*t"
                        ],
                        "to": [
                            "*t-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-x*"
                        ],
                        "to": [
                            "x*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-b*"
                        ],
                        "to": [
                            "b*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-/*"
                        ],
                        "to": [
                            "/*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-\\*"
                        ],
                        "to": [
                            "\\*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "xb*"
                        ],
                        "to": [
                            "-*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": "hurt"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "h*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": "heal"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "k*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": "get_key"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "l*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": "use_key!"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "d*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": "detonate"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-px*"
                        ],
                        "to": [
                            "px*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-qx*"
                        ],
                        "to": [
                            "qx*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "p*"
                                ],
                                "to": [
                                    "p-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-q"
                                        ],
                                        "to": [
                                            "*q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "eq"
                                        ],
                                        "to": [
                                            "*q"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "hq"
                                        ],
                                        "to": [
                                            "*q"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "kq"
                                        ],
                                        "to": [
                                            "*q"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "lq"
                                        ],
                                        "to": [
                                            "*q"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "dq"
                                        ],
                                        "to": [
                                            "*q"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "pb*"
                                ],
                                "to": [
                                    "p*-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-q"
                                        ],
                                        "to": [
                                            "bq"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "xq"
                                        ],
                                        "to": [
                                            "-q"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "q*"
                                ],
                                "to": [
                                    "q-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-p"
                                        ],
                                        "to": [
                                            "*p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "ep"
                                        ],
                                        "to": [
                                            "*p"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "hp"
                                        ],
                                        "to": [
                                            "*p"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "kp"
                                        ],
                                        "to": [
                                            "*p"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "lp"
                                        ],
                                        "to": [
                                            "*p"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "dp"
                                        ],
                                        "to": [
                                            "*p"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "qb*"
                                ],
                                "to": [
                                    "q*-"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-p"
                                        ],
                                        "to": [
                                            "bp"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "xp"
                                        ],
                                        "to": [
                                            "-p"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "east": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "t*-"
                        ],
                        "to": [
                            "-t*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*-"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*x-"
                        ],
                        "to": [
                            "-*x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*b-"
                        ],
                        "to": [
                            "-*b"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*/-"
                        ],
                        "to": [
                            "-*/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*\\-"
                        ],
                        "to": [
                            "-*\\"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*bx"
                        ],
                        "to": [
                            "-*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*e"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": "hurt"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*h"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": "heal"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*k"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": "get_key"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*l"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": "use_key!"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*d"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": "detonate"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*xp-"
                        ],
                        "to": [
                            "-*xp"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*xq-"
                        ],
                        "to": [
                            "-*xq"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*p"
                                ],
                                "to": [
                                    "-p"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "q*"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "qe"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "qh"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "qk"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "ql"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "qd"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*q"
                                ],
                                "to": [
                                    "-q"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "p*"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pe"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "ph"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pk"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pl"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pd"
                                        ],
                                        "side_effect": "detonate"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "p*"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pe"
                                        ],
                                        "side_effect": "hurt"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "ph"
                                        ],
                                        "side_effect": "heal"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pk"
                                        ],
                                        "side_effect": "get_key"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pl"
                                        ],
                                        "side_effect": "use_key!"
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pd"
                                        ],
                                        "side_effect": "detonate"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*bp"
                                ],
                                "to": [
                                    "-*p"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "qb"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "qx"
                                        ],
                                        "to": [
                                            "q-"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "*bq"
                                ],
                                "to": [
                                    "-*q"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "pb"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "px"
                                        ],
                                        "to": [
                                            "p-"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "piupiu": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            ">-"
                        ],
                        "to": [
                            "->"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">e"
                        ],
                        "to": [
                            "->"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">o"
                        ],
                        "to": [
                            "->"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-<"
                        ],
                        "to": [
                            "<-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e<"
                        ],
                        "to": [
                            "<-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o<"
                        ],
                        "to": [
                            "<-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?v",
                            "-/"
                        ],
                        "to": [
                            "?-",
                            "</"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?v",
                            "e/"
                        ],
                        "to": [
                            "?-",
                            "</"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?v",
                            "o/"
                        ],
                        "to": [
                            "?-",
                            "</"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v?",
                            "\\-"
                        ],
                        "to": [
                            "-?",
                            "\\>"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v?",
                            "\\e"
                        ],
                        "to": [
                            "-?",
                            "\\>"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v?",
                            "\\o"
                        ],
                        "to": [
                            "-?",
                            "\\>"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v",
                            "-"
                        ],
                        "to": [
                            "-",
                            "v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v",
                            "e"
                        ],
                        "to": [
                            "-",
                            "v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v",
                            "o"
                        ],
                        "to": [
                            "-",
                            "v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "^"
                        ],
                        "to": [
                            "^",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e",
                            "^"
                        ],
                        "to": [
                            "^",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o",
                            "^"
                        ],
                        "to": [
                            "^",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-\\",
                            "?^"
                        ],
                        "to": [
                            "<\\",
                            "?-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e\\",
                            "?^"
                        ],
                        "to": [
                            "<\\",
                            "?-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o\\",
                            "?^"
                        ],
                        "to": [
                            "<\\",
                            "?-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">\\",
                            "?-"
                        ],
                        "to": [
                            "-\\",
                            "?v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">\\",
                            "?e"
                        ],
                        "to": [
                            "-\\",
                            "?v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">\\",
                            "?o"
                        ],
                        "to": [
                            "-\\",
                            "?v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/<",
                            "-?"
                        ],
                        "to": [
                            "/-",
                            "v?"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/<",
                            "e?"
                        ],
                        "to": [
                            "/-",
                            "v?"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/<",
                            "o?"
                        ],
                        "to": [
                            "/-",
                            "v?"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-?",
                            "\\<"
                        ],
                        "to": [
                            "^?",
                            "\\-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e?",
                            "\\<"
                        ],
                        "to": [
                            "^?",
                            "\\-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o?",
                            "\\<"
                        ],
                        "to": [
                            "^?",
                            "\\-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/-",
                            "^?"
                        ],
                        "to": [
                            "/>",
                            "-?"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/e",
                            "^?"
                        ],
                        "to": [
                            "/>",
                            "-?"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/o",
                            "^?"
                        ],
                        "to": [
                            "/>",
                            "-?"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?-",
                            ">/"
                        ],
                        "to": [
                            "?^",
                            "-/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?e",
                            ">/"
                        ],
                        "to": [
                            "?^",
                            "-/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?o",
                            ">/"
                        ],
                        "to": [
                            "?^",
                            "-/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">\\",
                            "-/"
                        ],
                        "to": [
                            "-\\",
                            "</"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">\\",
                            "e/"
                        ],
                        "to": [
                            "-\\",
                            "</"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            ">\\",
                            "o/"
                        ],
                        "to": [
                            "-\\",
                            "</"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-\\",
                            ">/"
                        ],
                        "to": [
                            "<\\",
                            "-/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "e\\",
                            ">/"
                        ],
                        "to": [
                            "<\\",
                            "-/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o\\",
                            ">/"
                        ],
                        "to": [
                            "<\\",
                            "-/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/-",
                            "\\<"
                        ],
                        "to": [
                            "/>",
                            "\\-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/e",
                            "\\<"
                        ],
                        "to": [
                            "/>",
                            "\\-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/o",
                            "\\<"
                        ],
                        "to": [
                            "/>",
                            "\\-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/<",
                            "\\-"
                        ],
                        "to": [
                            "/-",
                            "\\>"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/<",
                            "\\e"
                        ],
                        "to": [
                            "/-",
                            "\\>"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/<",
                            "\\o"
                        ],
                        "to": [
                            "/-",
                            "\\>"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v-",
                            "\\/"
                        ],
                        "to": [
                            "-^",
                            "\\/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "ve",
                            "\\/"
                        ],
                        "to": [
                            "-^",
                            "\\/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "vo",
                            "\\/"
                        ],
                        "to": [
                            "-^",
                            "\\/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-v",
                            "\\/"
                        ],
                        "to": [
                            "^-",
                            "\\/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "ev",
                            "\\/"
                        ],
                        "to": [
                            "^-",
                            "\\/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "ov",
                            "\\/"
                        ],
                        "to": [
                            "^-",
                            "\\/"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/\\",
                            "^-"
                        ],
                        "to": [
                            "/\\",
                            "-v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/\\",
                            "^e"
                        ],
                        "to": [
                            "/\\",
                            "-v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/\\",
                            "^o"
                        ],
                        "to": [
                            "/\\",
                            "-v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/\\",
                            "-^"
                        ],
                        "to": [
                            "/\\",
                            "v-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/\\",
                            "e^"
                        ],
                        "to": [
                            "/\\",
                            "v-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "/\\",
                            "o^"
                        ],
                        "to": [
                            "/\\",
                            "v-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p<"
                                        ],
                                        "to": [
                                            "p-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?v",
                                            "p/"
                                        ],
                                        "to": [
                                            "?-",
                                            "p/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p\\",
                                            "?^"
                                        ],
                                        "to": [
                                            "p\\",
                                            "?-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            ">\\",
                                            "p/"
                                        ],
                                        "to": [
                                            "-\\",
                                            "p/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p\\",
                                            ">/"
                                        ],
                                        "to": [
                                            "p\\",
                                            "-/"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-q"
                                        ],
                                        "to": [
                                            "<q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "eq"
                                        ],
                                        "to": [
                                            "<q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "oq"
                                        ],
                                        "to": [
                                            "<q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/q",
                                            "-?"
                                        ],
                                        "to": [
                                            "/q",
                                            "v?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/q",
                                            "e?"
                                        ],
                                        "to": [
                                            "/q",
                                            "v?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/q",
                                            "o?"
                                        ],
                                        "to": [
                                            "/q",
                                            "v?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-?",
                                            "\\q"
                                        ],
                                        "to": [
                                            "^?",
                                            "\\q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e?",
                                            "\\q"
                                        ],
                                        "to": [
                                            "^?",
                                            "\\q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "o?",
                                            "\\q"
                                        ],
                                        "to": [
                                            "^?",
                                            "\\q"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q<"
                                        ],
                                        "to": [
                                            "q-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q\\",
                                            "?^"
                                        ],
                                        "to": [
                                            "q\\",
                                            "?-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?v",
                                            "q/"
                                        ],
                                        "to": [
                                            "?-",
                                            "q/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            ">\\",
                                            "q/"
                                        ],
                                        "to": [
                                            "-\\",
                                            "q/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q\\",
                                            ">/"
                                        ],
                                        "to": [
                                            "q\\",
                                            "-/"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-p"
                                        ],
                                        "to": [
                                            "<p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "ep"
                                        ],
                                        "to": [
                                            "<p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "op"
                                        ],
                                        "to": [
                                            "<p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/p",
                                            "-?"
                                        ],
                                        "to": [
                                            "/p",
                                            "v?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/p",
                                            "e?"
                                        ],
                                        "to": [
                                            "/p",
                                            "v?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/p",
                                            "o?"
                                        ],
                                        "to": [
                                            "/p",
                                            "v?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-?",
                                            "\\p"
                                        ],
                                        "to": [
                                            "^?",
                                            "\\p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e?",
                                            "\\p"
                                        ],
                                        "to": [
                                            "^?",
                                            "\\p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "o?",
                                            "\\p"
                                        ],
                                        "to": [
                                            "^?",
                                            "\\p"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "v",
                                            "q"
                                        ],
                                        "to": [
                                            "-",
                                            "q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            ">\\",
                                            "?q"
                                        ],
                                        "to": [
                                            "-\\",
                                            "?q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/<",
                                            "q?"
                                        ],
                                        "to": [
                                            "/-",
                                            "q?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/\\",
                                            "q^"
                                        ],
                                        "to": [
                                            "/\\",
                                            "q-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/\\",
                                            "^q"
                                        ],
                                        "to": [
                                            "/\\",
                                            "-q"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "-"
                                        ],
                                        "to": [
                                            "p",
                                            "v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "e"
                                        ],
                                        "to": [
                                            "p",
                                            "v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "o"
                                        ],
                                        "to": [
                                            "p",
                                            "v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p?",
                                            "\\-"
                                        ],
                                        "to": [
                                            "p?",
                                            "\\>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p?",
                                            "\\e"
                                        ],
                                        "to": [
                                            "p?",
                                            "\\>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p?",
                                            "\\o"
                                        ],
                                        "to": [
                                            "p?",
                                            "\\>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?p",
                                            "-/"
                                        ],
                                        "to": [
                                            "?p",
                                            "</"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?p",
                                            "e/"
                                        ],
                                        "to": [
                                            "?p",
                                            "</"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?p",
                                            "o/"
                                        ],
                                        "to": [
                                            "?p",
                                            "</"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "v",
                                            "p"
                                        ],
                                        "to": [
                                            "-",
                                            "p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/<",
                                            "p?"
                                        ],
                                        "to": [
                                            "/-",
                                            "p?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            ">\\",
                                            "?p"
                                        ],
                                        "to": [
                                            "-\\",
                                            "?p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/\\",
                                            "p^"
                                        ],
                                        "to": [
                                            "/\\",
                                            "p-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/\\",
                                            "^p"
                                        ],
                                        "to": [
                                            "/\\",
                                            "-p"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "-"
                                        ],
                                        "to": [
                                            "q",
                                            "v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "e"
                                        ],
                                        "to": [
                                            "q",
                                            "v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "o"
                                        ],
                                        "to": [
                                            "q",
                                            "v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q?",
                                            "\\-"
                                        ],
                                        "to": [
                                            "q?",
                                            "\\>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q?",
                                            "\\e"
                                        ],
                                        "to": [
                                            "q?",
                                            "\\>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q?",
                                            "\\o"
                                        ],
                                        "to": [
                                            "q?",
                                            "\\>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?q",
                                            "-/"
                                        ],
                                        "to": [
                                            "?q",
                                            "</"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?q",
                                            "e/"
                                        ],
                                        "to": [
                                            "?q",
                                            "</"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?q",
                                            "o/"
                                        ],
                                        "to": [
                                            "?q",
                                            "</"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            ">p"
                                        ],
                                        "to": [
                                            "-p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/p",
                                            "^?"
                                        ],
                                        "to": [
                                            "/p",
                                            "-?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "v?",
                                            "\\p"
                                        ],
                                        "to": [
                                            "-?",
                                            "\\p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/<",
                                            "\\p"
                                        ],
                                        "to": [
                                            "/-",
                                            "\\p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/p",
                                            "\\<"
                                        ],
                                        "to": [
                                            "/p",
                                            "\\-"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q-"
                                        ],
                                        "to": [
                                            "q>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "qe"
                                        ],
                                        "to": [
                                            "q>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "qo"
                                        ],
                                        "to": [
                                            "q>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q\\",
                                            "?-"
                                        ],
                                        "to": [
                                            "q\\",
                                            "?v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q\\",
                                            "?e"
                                        ],
                                        "to": [
                                            "q\\",
                                            "?v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q\\",
                                            "?o"
                                        ],
                                        "to": [
                                            "q\\",
                                            "?v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?-",
                                            "q/"
                                        ],
                                        "to": [
                                            "?^",
                                            "q/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?e",
                                            "q/"
                                        ],
                                        "to": [
                                            "?^",
                                            "q/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?o",
                                            "q/"
                                        ],
                                        "to": [
                                            "?^",
                                            "q/"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p",
                                            "^"
                                        ],
                                        "to": [
                                            "p",
                                            "-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?p",
                                            ">/"
                                        ],
                                        "to": [
                                            "?p",
                                            "-/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p?",
                                            "\\<"
                                        ],
                                        "to": [
                                            "p?",
                                            "\\-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "pv",
                                            "\\/"
                                        ],
                                        "to": [
                                            "p-",
                                            "\\/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "vp",
                                            "\\/"
                                        ],
                                        "to": [
                                            "-p",
                                            "\\/"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-",
                                            "q"
                                        ],
                                        "to": [
                                            "^",
                                            "q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e",
                                            "q"
                                        ],
                                        "to": [
                                            "^",
                                            "q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "o",
                                            "q"
                                        ],
                                        "to": [
                                            "^",
                                            "q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/-",
                                            "q?"
                                        ],
                                        "to": [
                                            "/>",
                                            "q?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/e",
                                            "q?"
                                        ],
                                        "to": [
                                            "/>",
                                            "q?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/o",
                                            "q?"
                                        ],
                                        "to": [
                                            "/>",
                                            "q?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-\\",
                                            "?q"
                                        ],
                                        "to": [
                                            "<\\",
                                            "?q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e\\",
                                            "?q"
                                        ],
                                        "to": [
                                            "<\\",
                                            "?q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "o\\",
                                            "?q"
                                        ],
                                        "to": [
                                            "<\\",
                                            "?q"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q",
                                            "^"
                                        ],
                                        "to": [
                                            "q",
                                            "-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?q",
                                            ">/"
                                        ],
                                        "to": [
                                            "?q",
                                            "-/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "q?",
                                            "\\<"
                                        ],
                                        "to": [
                                            "q?",
                                            "\\-"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "qv",
                                            "\\/"
                                        ],
                                        "to": [
                                            "q-",
                                            "\\/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "vq",
                                            "\\/"
                                        ],
                                        "to": [
                                            "-q",
                                            "\\/"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-",
                                            "p"
                                        ],
                                        "to": [
                                            "^",
                                            "p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e",
                                            "p"
                                        ],
                                        "to": [
                                            "^",
                                            "p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "o",
                                            "p"
                                        ],
                                        "to": [
                                            "^",
                                            "p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/-",
                                            "p?"
                                        ],
                                        "to": [
                                            "/>",
                                            "p?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/e",
                                            "p?"
                                        ],
                                        "to": [
                                            "/>",
                                            "p?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/o",
                                            "p?"
                                        ],
                                        "to": [
                                            "/>",
                                            "p?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "-\\",
                                            "?p"
                                        ],
                                        "to": [
                                            "<\\",
                                            "?p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "e\\",
                                            "?p"
                                        ],
                                        "to": [
                                            "<\\",
                                            "?p"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "o\\",
                                            "?p"
                                        ],
                                        "to": [
                                            "<\\",
                                            "?p"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            ">q"
                                        ],
                                        "to": [
                                            "-q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/q",
                                            "^?"
                                        ],
                                        "to": [
                                            "/q",
                                            "-?"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "v?",
                                            "\\q"
                                        ],
                                        "to": [
                                            "-?",
                                            "\\q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/<",
                                            "\\q"
                                        ],
                                        "to": [
                                            "/-",
                                            "\\q"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "/q",
                                            "\\<"
                                        ],
                                        "to": [
                                            "/q",
                                            "\\-"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            },
                            {
                                "type": "match1",
                                "rules": [
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p-"
                                        ],
                                        "to": [
                                            "p>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "pe"
                                        ],
                                        "to": [
                                            "p>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "po"
                                        ],
                                        "to": [
                                            "p>"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p\\",
                                            "?-"
                                        ],
                                        "to": [
                                            "p\\",
                                            "?v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p\\",
                                            "?e"
                                        ],
                                        "to": [
                                            "p\\",
                                            "?v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "p\\",
                                            "?o"
                                        ],
                                        "to": [
                                            "p\\",
                                            "?v"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?-",
                                            "p/"
                                        ],
                                        "to": [
                                            "?^",
                                            "p/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?e",
                                            "p/"
                                        ],
                                        "to": [
                                            "?^",
                                            "p/"
                                        ],
                                        "side_effect": null
                                    },
                                    {
                                        "type": "simple",
                                        "from": [
                                            "?o",
                                            "p/"
                                        ],
                                        "to": [
                                            "?^",
                                            "p/"
                                        ],
                                        "side_effect": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "hurt": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "HP:..."
                        ],
                        "to": [
                            "HP:..-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "HP:..-"
                        ],
                        "to": [
                            "HP:.--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "HP:.--"
                        ],
                        "to": [
                            "HP:---"
                        ],
                        "side_effect": "die"
                    }
                ]
            },
            "die": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*"
                        ],
                        "to": [
                            "-"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "heal": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "HP:..-"
                        ],
                        "to": [
                            "HP:..."
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "HP:.--"
                        ],
                        "to": [
                            "HP:..-"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "get_key": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "KEYS:---"
                        ],
                        "to": [
                            "KEYS:.--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "KEYS:.--"
                        ],
                        "to": [
                            "KEYS:..-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "KEYS:..-"
                        ],
                        "to": [
                            "KEYS:..."
                        ],
                        "side_effect": null
                    }
                ]
            },
            "use_key": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "KEYS:..."
                        ],
                        "to": [
                            "KEYS:..-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "KEYS:..-"
                        ],
                        "to": [
                            "KEYS:.--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "KEYS:.--"
                        ],
                        "to": [
                            "KEYS:---"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "detonate": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "???",
                            "?t?",
                            "???"
                        ],
                        "to": [
                            "---",
                            "---",
                            "---"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "???",
                            "?t?"
                        ],
                        "to": [
                            "---",
                            "---"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?t?",
                            "???"
                        ],
                        "to": [
                            "---",
                            "---"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "??",
                            "?t",
                            "??"
                        ],
                        "to": [
                            "--",
                            "--",
                            "--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "??",
                            "t?",
                            "??"
                        ],
                        "to": [
                            "--",
                            "--",
                            "--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "t?",
                            "??"
                        ],
                        "to": [
                            "--",
                            "--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "??",
                            "t?"
                        ],
                        "to": [
                            "--",
                            "--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "?t",
                            "??"
                        ],
                        "to": [
                            "--",
                            "--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "??",
                            "?t"
                        ],
                        "to": [
                            "--",
                            "--"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "t"
                        ],
                        "to": [
                            "-"
                        ],
                        "side_effect": null
                    }
                ]
            }
        },
        "binds": {
            "w": "north",
            "s": "south",
            "a": "west",
            "d": "east",
            "z": "piupiu"
        },
        "goals": [],
        "voids": [
            [
                "o"
            ]
        ]
    },
    "turing": {
        "boards": [
            [
                "###################--!--!--!--!--!--!--",
                "#State:A---------##--A--A--B--B--C--C--",
                "#----------------##--0--1--0--1--0--1--",
                "p--------v-------q#--1--1--1--1--1--1--",
                "#0000000000000000##--B--C--A--B--B--H--",
                "###################--R--L--L--R--L--R--",
                "---------------------------------------",
                "-----------------------*---------------",
                "-A--B--C--0--1--L--R--N--H-------------",
                "-A--B--C--0--1--L--R--N--H-------------",
                "-A--B--C--0--1--L--R--N--H-------------",
                "-A--B--C--0--1--L--R--N--H-------------",
                "-A--B--C--0--1--L--R--N--H-------------",
                "-A--B--C--0--1--L--R--N--H-------------",
                "---------------------------------------"
            ],
            [
                "###################--!--!--!--!--!--!--!--!-",
                "#State:A---------##--A--A--B--B--C--C--D--D-",
                "#----------------##--0--1--0--1--0--1--0--1-",
                "p--------v-------q#--1--1--1--0--1--1--1--0-",
                "#0000000000000000##--B--B--A--C--H--D--D--A-",
                "###################--R--L--L--L--R--L--R--R-",
                "--------------------------------------------",
                "-----------------------*--------------------",
                "-A--B--C--D--0--1--L--R--N--H---------------",
                "-A--B--C--D--0--1--L--R--N--H---------------",
                "-A--B--C--D--0--1--L--R--N--H---------------",
                "-A--B--C--D--0--1--L--R--N--H---------------",
                "-A--B--C--D--0--1--L--R--N--H---------------",
                "-A--B--C--D--0--1--L--R--N--H---------------",
                "--------------------------------------------"
            ],
            [
                "######################################################-",
                "#State:A--------------------------------------------##-",
                "#---------------------------------------------------##-",
                "p--------v------------------------------------------q#-",
                "#000000000000000000000000000000000000000000000000000##-",
                "######################################################-",
                "-------------------------------------------------------",
                "-----------------------*-------------------------------",
                "-!--!--!--!--!--!--!--!--!--!--------------------------",
                "-A--A--B--B--C--C--D--D--E--E--------------------------",
                "-0--1--0--1--0--1--0--1--0--1--------------------------",
                "-1--1--1--1--1--0--1--1--1--0--------------------------",
                "-B--C--C--B--D--E--A--D--H--A--------------------------",
                "-R--L--R--R--R--L--L--L--R--L--------------------------",
                "-------------------------------------------------------"
            ]
        ],
        "rules": {
            "north": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "A",
                            "*"
                        ],
                        "to": [
                            "A",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "B",
                            "*"
                        ],
                        "to": [
                            "B",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "C",
                            "*"
                        ],
                        "to": [
                            "C",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "D",
                            "*"
                        ],
                        "to": [
                            "D",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "E",
                            "*"
                        ],
                        "to": [
                            "E",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "H",
                            "*"
                        ],
                        "to": [
                            "H",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "0",
                            "*"
                        ],
                        "to": [
                            "0",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "1",
                            "*"
                        ],
                        "to": [
                            "1",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "L",
                            "*"
                        ],
                        "to": [
                            "L",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "R",
                            "*"
                        ],
                        "to": [
                            "R",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "south": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "A",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "A"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "B",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "B"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "C",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "C"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "D",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "D"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "E",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "E"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "H",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "H"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "0",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "0"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "1",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "1"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "L",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "L"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "R",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "R"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "west": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-A*"
                        ],
                        "to": [
                            "A*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-B*"
                        ],
                        "to": [
                            "B*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-C*"
                        ],
                        "to": [
                            "C*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-D*"
                        ],
                        "to": [
                            "D*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-E*"
                        ],
                        "to": [
                            "E*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-H*"
                        ],
                        "to": [
                            "H*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-0*"
                        ],
                        "to": [
                            "0*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-1*"
                        ],
                        "to": [
                            "1*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-L*"
                        ],
                        "to": [
                            "L*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-R*"
                        ],
                        "to": [
                            "R*-"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "east": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*-"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*A-"
                        ],
                        "to": [
                            "-*A"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*B-"
                        ],
                        "to": [
                            "-*B"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*C-"
                        ],
                        "to": [
                            "-*C"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*D-"
                        ],
                        "to": [
                            "-*D"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*E-"
                        ],
                        "to": [
                            "-*E"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*H-"
                        ],
                        "to": [
                            "-*H"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*0-"
                        ],
                        "to": [
                            "-*0"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*1-"
                        ],
                        "to": [
                            "-*1"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*L-"
                        ],
                        "to": [
                            "-*L"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*R-"
                        ],
                        "to": [
                            "-*R"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "step": {
                "type": "match1",
                "rules": [
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "A",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "B",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "C",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "D",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "E",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "H",
                                    "L"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "left"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "A",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:A"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "B",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:B"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "C",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:C"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "D",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:D"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "E",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:E"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "A",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:A"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "B",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:B"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "C",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:C"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "D",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:D"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "E",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:E"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "0",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "0"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "0",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "0"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    },
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "to": [
                                    "!",
                                    "H",
                                    "1",
                                    "1",
                                    "H",
                                    "R"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "State:H"
                                ],
                                "to": [
                                    "State:H"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "v",
                                    "1"
                                ],
                                "to": [
                                    "v",
                                    "1"
                                ],
                                "side_effect": "right"
                            }
                        ]
                    }
                ]
            },
            "left": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-v"
                        ],
                        "to": [
                            "v-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v"
                        ],
                        "to": [
                            "-"
                        ],
                        "side_effect": "teleport_right"
                    }
                ]
            },
            "right": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "v-"
                        ],
                        "to": [
                            "-v"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "v"
                        ],
                        "to": [
                            "-"
                        ],
                        "side_effect": "teleport_left"
                    }
                ]
            },
            "teleport_left": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "p-"
                        ],
                        "to": [
                            "pv"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "teleport_right": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-q"
                        ],
                        "to": [
                            "vq"
                        ],
                        "side_effect": null
                    }
                ]
            }
        },
        "binds": {
            "w": "north",
            "s": "south",
            "a": "west",
            "d": "east",
            "z": "step"
        },
        "goals": [
            [
                "State:H"
            ]
        ],
        "voids": []
    },
    "sokoban": {
        "boards": [
            [
                "##---#",
                "o*x--#",
                "##-xo#",
                "o##x-#",
                "-#-o-#",
                "x-Xxxo",
                "---o--"
            ]
        ],
        "rules": {
            "north": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "*"
                        ],
                        "to": [
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "!"
                        ],
                        "to": [
                            "*",
                            "o"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o",
                            "*"
                        ],
                        "to": [
                            "!",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "x",
                            "*"
                        ],
                        "to": [
                            "x",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o",
                            "x",
                            "*"
                        ],
                        "to": [
                            "X",
                            "*",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "X",
                            "*"
                        ],
                        "to": [
                            "x",
                            "!",
                            "-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-",
                            "x",
                            "!"
                        ],
                        "to": [
                            "x",
                            "*",
                            "o"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o",
                            "x",
                            "!"
                        ],
                        "to": [
                            "X",
                            "*",
                            "o"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "south": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "!",
                            "-"
                        ],
                        "to": [
                            "o",
                            "*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "o"
                        ],
                        "to": [
                            "-",
                            "!"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "x",
                            "-"
                        ],
                        "to": [
                            "-",
                            "*",
                            "x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "x",
                            "o"
                        ],
                        "to": [
                            "-",
                            "*",
                            "X"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*",
                            "X",
                            "-"
                        ],
                        "to": [
                            "-",
                            "!",
                            "x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "!",
                            "x",
                            "-"
                        ],
                        "to": [
                            "o",
                            "*",
                            "x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "!",
                            "x",
                            "o"
                        ],
                        "to": [
                            "o",
                            "*",
                            "X"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "west": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "-*"
                        ],
                        "to": [
                            "*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-!"
                        ],
                        "to": [
                            "*o"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "o*"
                        ],
                        "to": [
                            "!-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-x*"
                        ],
                        "to": [
                            "x*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "ox*"
                        ],
                        "to": [
                            "X*-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-X*"
                        ],
                        "to": [
                            "x!-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "-x!"
                        ],
                        "to": [
                            "x*o"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "ox!"
                        ],
                        "to": [
                            "X*o"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "east": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*-"
                        ],
                        "to": [
                            "-*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "!-"
                        ],
                        "to": [
                            "o*"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*o"
                        ],
                        "to": [
                            "-!"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*x-"
                        ],
                        "to": [
                            "-*x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*xo"
                        ],
                        "to": [
                            "-*X"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*X-"
                        ],
                        "to": [
                            "-!x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "!x-"
                        ],
                        "to": [
                            "o*x"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "!xo"
                        ],
                        "to": [
                            "o*X"
                        ],
                        "side_effect": null
                    }
                ]
            }
        },
        "binds": {
            "w": "north",
            "s": "south",
            "a": "west",
            "d": "east"
        },
        "goals": [],
        "voids": [
            [
                "o"
            ]
        ]
    },
    "fight": {
        "boards": [
            [
                "----------------------",
                "----------------------",
                "-*------------------@-",
                "----------------------",
                "----------------------",
                "______________________",
                "*:...........---------",
                "@:...........---------",
                "POTIONS:...-----------",
                "STAMINA:.....---------",
                "STATE:PlayerTurn------"
            ]
        ],
        "rules": {
            "next": {
                "type": "match1",
                "rules": [
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "STATE:EnemyTurn-"
                                ],
                                "to": [
                                    "STATE:PlayerTurn"
                                ],
                                "side_effect": null
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "?"
                                ],
                                "to": [
                                    "?"
                                ],
                                "side_effect": "damage_*"
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "?"
                                ],
                                "to": [
                                    "?"
                                ],
                                "side_effect": "damage_*"
                            }
                        ]
                    }
                ]
            },
            "attack": {
                "type": "match1",
                "rules": [
                    {
                        "type": "atomic",
                        "rules": [
                            {
                                "type": "simple",
                                "from": [
                                    "STATE:PlayerTurn"
                                ],
                                "to": [
                                    "STATE:EnemyTurn-"
                                ],
                                "side_effect": "damage_@"
                            },
                            {
                                "type": "simple",
                                "from": [
                                    "?"
                                ],
                                "to": [
                                    "?"
                                ],
                                "side_effect": "spend_stamina!"
                            }
                        ]
                    }
                ]
            },
            "heal": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "STATE:PlayerTurn"
                        ],
                        "to": [
                            "STATE:EnemyTurn-"
                        ],
                        "side_effect": "use_potion"
                    }
                ]
            },
            "rest": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "STATE:PlayerTurn"
                        ],
                        "to": [
                            "STATE:EnemyTurn-"
                        ],
                        "side_effect": "gain_stamina"
                    }
                ]
            },
            "use_potion": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "POTIONS:..."
                        ],
                        "to": [
                            "POTIONS:..-"
                        ],
                        "side_effect": "restore_health"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "POTIONS:.."
                        ],
                        "to": [
                            "POTIONS:.-"
                        ],
                        "side_effect": "restore_health"
                    },
                    {
                        "type": "simple",
                        "from": [
                            "POTIONS:."
                        ],
                        "to": [
                            "POTIONS:-"
                        ],
                        "side_effect": "restore_health"
                    }
                ]
            },
            "spend_stamina": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:....."
                        ],
                        "to": [
                            "STAMINA:....-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:...."
                        ],
                        "to": [
                            "STAMINA:...-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:..."
                        ],
                        "to": [
                            "STAMINA:..-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:.."
                        ],
                        "to": [
                            "STAMINA:.-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:."
                        ],
                        "to": [
                            "STAMINA:-"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "gain_stamina": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:---"
                        ],
                        "to": [
                            "STAMINA:..."
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:.---"
                        ],
                        "to": [
                            "STAMINA:...."
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:...--"
                        ],
                        "to": [
                            "STAMINA:....."
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "STAMINA:....-"
                        ],
                        "to": [
                            "STAMINA:....."
                        ],
                        "side_effect": null
                    }
                ]
            },
            "restore_health": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*:?????????"
                        ],
                        "to": [
                            "*:........."
                        ],
                        "side_effect": null
                    }
                ]
            },
            "damage_@": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "@:..........."
                        ],
                        "to": [
                            "@:..........-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:.........."
                        ],
                        "to": [
                            "@:.........-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:........."
                        ],
                        "to": [
                            "@:........-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:........"
                        ],
                        "to": [
                            "@:.......-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:......."
                        ],
                        "to": [
                            "@:......-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:......"
                        ],
                        "to": [
                            "@:.....-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:....."
                        ],
                        "to": [
                            "@:....-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:...."
                        ],
                        "to": [
                            "@:...-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:..."
                        ],
                        "to": [
                            "@:..-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:.."
                        ],
                        "to": [
                            "@:.-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "@:."
                        ],
                        "to": [
                            "@:-"
                        ],
                        "side_effect": "kill_@"
                    }
                ]
            },
            "kill_@": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "@"
                        ],
                        "to": [
                            "-"
                        ],
                        "side_effect": "win"
                    }
                ]
            },
            "win": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "STATE:????????????????"
                        ],
                        "to": [
                            "STATE:Victory---------"
                        ],
                        "side_effect": null
                    }
                ]
            },
            "damage_*": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*:..........."
                        ],
                        "to": [
                            "*:..........-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:.........."
                        ],
                        "to": [
                            "*:.........-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:........."
                        ],
                        "to": [
                            "*:........-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:........"
                        ],
                        "to": [
                            "*:.......-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:......."
                        ],
                        "to": [
                            "*:......-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:......"
                        ],
                        "to": [
                            "*:.....-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:....."
                        ],
                        "to": [
                            "*:....-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:...."
                        ],
                        "to": [
                            "*:...-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:..."
                        ],
                        "to": [
                            "*:..-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:.."
                        ],
                        "to": [
                            "*:.-"
                        ],
                        "side_effect": null
                    },
                    {
                        "type": "simple",
                        "from": [
                            "*:."
                        ],
                        "to": [
                            "*:-"
                        ],
                        "side_effect": "kill_*"
                    }
                ]
            },
            "kill_*": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "*"
                        ],
                        "to": [
                            "-"
                        ],
                        "side_effect": "lose"
                    }
                ]
            },
            "lose": {
                "type": "match1",
                "rules": [
                    {
                        "type": "simple",
                        "from": [
                            "STATE:????????????????"
                        ],
                        "to": [
                            "STATE:Defeat----------"
                        ],
                        "side_effect": null
                    }
                ]
            }
        },
        "binds": {
            "a": "attack",
            "s": "rest",
            "d": "heal",
            "z": "next"
        },
        "goals": [],
        "voids": [
            [
                "@-"
            ]
        ]
    }
};