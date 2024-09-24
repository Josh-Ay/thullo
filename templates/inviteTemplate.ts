export const inviteEmailTemplate = `
<div style="background-color: #f8f9fd; width: 100%; height: 100%; padding: 40px 0;">
    <div style="background-color: white; border-radius: 8px; width: 80%; margin: 0 auto; padding: 30px 20px;">
        <img
            src={{ logoImg }}
            alt='thullo logo'
            style='max-width: 100%; width: 5rem;'
        />

        <p>Hello there!</p>

        <img
            src='https://img.freepik.com/free-vector/group-people-waving-hand_23-2148361693.jpg?t=st=1725534629~exp=1725538229~hmac=8562911e107abe4f1a70d15d7669e4647f2673d3e9c2f29e1e69efdc4dc6c11b&w=1060'
            alt='people waving from freepik'
            style='max-width: 100%; width: max-content; height: 12rem; object-fit: contain; display: block; margin-right: auto; margin-top: 12px; margin-bottom: 12px;'
        />

        <p>You have been invited by {{ senderName }} to collaborate on <strong>{{ itemTitle }}</strong> on Thullo.</p>

        <p>Please click on the link below to join:</p>

        <button
            style='
                border: none;
                outline: none;
                background: none;
            '
        >
            <a
                style='
                    display: block;
                    text-align: center;
                    padding: 0.7rem 0;
                    text-decoration: none;
                    background: #2F80ED;
                    color: #fff;
                    width: 4rem;
                    border-radius: 8px;
                    margin: 0 auto 12px;
                '
                href="{{ content }}"
                target='_blank'
                rel='noreferrer noopener'
            >
                Join
            </a>
        </button>

        <p>If you can't click the button, you can also copy and paste the following link into your browser's address bar:</p>

        {{ content }}

        <p style="margin-top: 22px; margin-bottom: 0;">Kind regards,</p>
        <p style="margin-top: 0;">Thullo Support Team.</p>
    </div>
</div>
`