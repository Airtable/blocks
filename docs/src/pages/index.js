import React from 'react';
import {Link} from 'gatsby';

import Layout from '../components/layout';

const IndexPage = () => (
    <Layout>
        <h1>Hello, Blocks developer!</h1>
        <p>
            Thanks for participating in the developer preview of the Airtable Blocks platform!
            Before today, all blocks were developed by Airtable. No longer! You're now able to
            supercharge your own workflows.
        </p>
        <p>
            By participating in the developer preview and using the software, you accept and agree
            to abide by terms of the <Link to="/tos">developer preview agreement</Link>.
        </p>
        <h2>If you're new to writing blocks</h2>
        <ol>
            <li>
                First, follow our <Link to="/guides/setup/">setup guide</Link>. You'll learn how to
                get your blocks <strong>dev environment set up</strong>, and how to write a{' '}
                <strong>"Hello, World" block</strong>.
            </li>

            <li>
                Follow our guide to writing a <Link to="/guides/todo">to-do list block</Link>.
                You'll learn how to <strong>query</strong> and <strong>display data</strong> from
                your base, how to use core Airtable functions like "expand record", how to use the{' '}
                <strong>built in component library</strong> to let the user choose a table, and how
                to <strong>store user preferences</strong>.
            </li>
        </ol>
        <h2>If you want to figure out how to do something specific</h2>
        <h4>API documentation</h4>
        <p>
            The <Link to="/api">API documentation</Link> documents most public methods, and code
            examples.
        </p>
        <h4>Example block source code</h4>
        <a name="examples"></a>

        <p>
            Here is the code for several example blocks. You can read it to learn techniques and see
            best practices for blocks development. And you can use it as a jumping off point for
            your own blocks.
        </p>

        <ul>
            <li>
                <a href="https://github.com/Airtable/blocks/tree/master/examples/simple_chart">
                    Simple chart
                </a>{' '}
                - Shows a bar <strong>chart</strong> of base data using the Chart.js{' '}
                <strong>external library</strong>.
            </li>

            <li>
                <a href="https://github.com/Airtable/blocks/tree/master/examples/todo">
                    To-do list
                </a>{' '}
                - The code for the to-do list example from the guide above.
            </li>
            <li>
                <a href="https://github.com/Airtable/blocks/tree/master/examples/summary">
                    Summary
                </a>{' '}
                - Uses the <strong>built-in summary functions</strong> (average, max, etc.) on a
                table field.
            </li>
            <li>
                <a href="https://github.com/Airtable/blocks/tree/master/examples/youtube_preview">
                    YouTube preview
                </a>{' '}
                - Uses the <strong>cursor API</strong> to{' '}
                <strong>detect when the user selects a record</strong> in grid view. If that record
                has a YouTube URL, the block shows the corresponding <strong>video</strong>.
            </li>
        </ul>
    </Layout>
);

export default IndexPage;
