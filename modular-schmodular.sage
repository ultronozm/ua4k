def elliptic_curve_q_series_up_to_bound(bound):
    curves = []
    for N in range(1, bound):
        try:
            E = EllipticCurve(f'{N}a1')
            if E.conductor() == N:
                curves.append(E)
        except:
            continue
    return [E.modular_form().qexp(20) for E in modular_curves]

def to_binary(s):
    binary = ''
    for char in s:
        binary += format(ord(char), '08b')
    return binary

def coef_max(n):
    return floor(number_of_divisors(n) * sqrt(n))

def random_cyclic_shift(string):
    length = len(string)
    shift = randint(0, length-1)
    return string[shift:] + string[:shift]

def random_q_exp(prec, binary):
    sequence = [0,1]
    index = 0
    binary = random_cyclic_shift(binary)
    for n in range(2, prec):
        if is_prime(n):
            M = coef_max(n)
            a = -M
            b = M
            while b > a:
                c = (a + b) // 2
                bit = int(binary[index])
                index += 1
                if bit == 1:
                    a = c + 1
                else:
                    b = c
            sequence.append(a)
        else:
            m = divisors(n)[1]
            k = ZZ(n/m)
            total = sequence[m] * sequence[k]
            for d in gcd(m,k).divisors():
                if d == 1:
                    continue
                total -= d * sequence[(m/d) * (k/d)]
            sequence.append(total)
    R.<q> = PowerSeriesRing(QQ)
    return sum([sequence[i] * q^(i) for i in range(1,prec)])

# https://www.oocities.org/yadz5/lrh5.htm
dianetics_jingle = [
    "Anything you can take, you can make.",
    "Anything you can see, you can be.",
    "Anything you shun will have won.",
    "Anything you have done you can do.",
    "Anything that is work is a shirk.",
    "Anything you desire means expire.",
    "If you ever need bait just create.",
    "If a motion comes in, use and win.",
    "If a motion you won't use you will lose.",
    "If all motion comes in, that's a sin.",
    "If motion from you flows, the world glows.",
    "If beauty you desire, beauty transpire.",
    "If  tone tends toward spin, you're taking motion in.",
    "If tone is to soar, create even more.",
    "If you don't want the real, always steal.",
    "If you want the whole sky, never buy.",
    "If you don't want remorse, just be source.",
    "If you don't want to see, with all motion agree.",
    "If you want to be tall, just be all.",
    "If you ever repent, you are spent.",
    "If you act in today, you keep morrow away.",
    "If you act in the past, you won't last.",
    "If you have to be liked, you are spiked.",
    "If you choose to agree, you're a tree.",
    "If you want others' gain, you're insane.",
    "If all things you eschew, they are glue.",
    "If your body you'd leave, don't believe.",
    "The way out of MEST ain't detest.",
    "If you'd soar to the blue, just go through.",
    "If all things you would flee, these you'll be.",
    "If you want to destroy, just annoy.",
    "If you just want to heal, make him real.",
    "All the things that come in are a sin.",
    "Whatever is cause , to it everything draws.",
    "Whatever is wrecked was effect.",
    "If high tones shun the low, the suns brighter glow.",
    "When a high tone fights entheta, he comes in very later.",
    "Entheta is just matter kicking up a final splatter.",
    "If your MEST is in disorder, your case is on the border.",
    "If your MEST is in good shape, you haven't time to hate.",
    "If all things you would create, you'd better be in time and date.",
    "If through other's thoughts you plow, you will come at last to now.",
    "If you don't want to be attacked don't draw back.",
    "If all evil you'd burn down simply up and build a town.",
    "There is no trick to being unless you spend your time agreeing.",
    "If you don't have a datum, create 'em.",
    "The only unknowns are in other men's domes.",
    "The real universe is a hearse.",
    "The right way to be is to be.",
    "When aesthetics are sex, there've been wrecks.",
    "If you want to be pure don't endure.",
    "If you want to last just move fast.",
    "If all things you'd deserve, don't preserve.",
    "If the world's all your brother, you're just another.",
    "Those who gave us mystic were sadistic.",
    "No wise man should stammer because another shuns his grammar.",
    "Don't ever go down scale, because MEST won't get up & cheer & hail!",
    "If you would overrate, just let it make you rate.",
    "The bottom of disease is anxiety to please.",
    "You can blame your whole confusion on the fact you bought illusion.",
    "The always last sung song, 'I was wrong.'",
    "You'll never climb a steeple if you worry about people.",
    "If all misery is bested, you've the universe invested.",
    "Just because it made you fall doesn't prove that it is all.",
    "If you get caught in the middle it's because you've bought a riddle.",
    "If you want things in delirium, just get serium.",
    "If the engrams you'd keep in, study hard to know of sin.",
    "If you want an empty larder, tell yourself you must work harder.",
    "If your vision is all blurry, you've bought another's worry.",
    "If you want to be in chains, let some other buy your brains.",
    "If from another's grace you'd fall, just pretend that you aren't all.",
    "If you find yourself well under, it's because you define blunder.",
    "The entire source of pain is an effort to abstain.",
    "A calm and peaceful mind has refused to put trouble behind.",
    "A really sharp obsession is from lack of self-confession.",
    "If you really want to let it, forget it.",
    "If you want to get real tragic, forget it was just magic.",
    "If you really want the stutters, respect the rights of others.",
    "If you want to be tearful, be careful.",
    "The upset of tradition is the way to eat roast pigeon.",
    "The craving for a drink is creation of a brink.",
    "The desire to be hugged is a craving to be drugged.",
    "A creeping inhibition is a stable definition.",
    "The only reason some people find ambition is a spike,",
    "is they don't try to be, they try to be like.",
    "If you're awfully deject, you're defect."]

def generate_modular():
    data = elliptic_curve_q_series_up_to_bound(1000)
    return [str(d) for d in data]

def generate_schmodular():
    return [str(random_q_exp(20, to_binary(d))) + ' + O(q^20)' for d in dianetics_jingle]
